import express from 'express'
import Funcao from './functions'
import Banco from '../Banco/connect'
import Cadastro from '../Banco/migrations/insert'
import Consulta from '../Banco/migrations/consulta'

const router = express.Router()


// Rota para Login

router.post('/login', async (req, res, ) => {
    const email = req.body.email
    const senha = req.body.password    
    const user= await Banco.session(`SELECT id_user, senha FROM Vendi.user u where u.email= '${email}'`)
    if(user.rows[0]){
        const descript = await Funcao.compare(senha,user.rows[0].senha)        
        if(descript == true){
            const token= Funcao.gerajwt(user.rows[0].id_user)
              res.status(200).json({token})
        }else{
            console.log({Erro: 'Senha Invalida'})
            res.status(401).json({token:[]})
        }
    }else{
        console.log({Erro: 'Email não encontrado'})
        res.status(401).json({token:[]})
    }
})
// Rota para cadastro de usuario
// lembrete caso tenha o usuario, já irá mandar o token
router.post('/cadastro', async (req, res, ) => {
    const nome  = req.body.nome
    const email = req.body.email
    const senha = req.body.password    
    const user= await Banco.session(`SELECT id_user, senha FROM Vendi.user u where u.email= '${email}'`)
    if(user.rows[0]){
        const descript = await Funcao.compare(senha,user.rows[0].senha)        
        if(descript == true){
            const token= Funcao.gerajwt(user.rows[0].id_user)
              res.status(200).json({token})
        }else{
            console.log({Erro: 'Senha Invalida'})
            res.status(401).json({token:[]})
        }
    }else{        
        const password= await Funcao.cripto(senha)
        await Banco.session(`INSERT INTO Vendi.user(nome,email, senha)VALUES ('${nome}','${email}','${password}');`)
        const iduser = await Banco.session(`SELECT id_user FROM Vendi.user u where u.email= '${email}' and u.senha= '${password}';`)
        if(iduser.rows[0].id_user>0){
            const token= Funcao.gerajwt(iduser.rows[0].id_user)
              res.status(200).json({token})
        }else{
            console.log({Erro: 'Erro ao gravar no banco de dados, por favor verifique os dados.'})
            res.status(401).json({token:[]})
        }
    }
})

//Rota para envio de email para redefinição de senha
router.put('/enviarEmailDeRedefinicao', async (req, res, ) => {
    const nome = 'Redefinição de senha';
    const email = req.body.email
    const user = await Banco.session(`SELECT id_user, senha FROM Vendi.user u where u.email= '${email}'`)
    if(user.rows[0]){
        const token= Funcao.gerajwtsenha(email)
        const url = ('https://vendiapi.herokuapp.com/user/redefinirsenha/'+token)
        const recepcaoEmail=await Funcao.enviaremail(email, nome,url)   
        res.json({recepcaoEmail})
    }
})
//rota demostração tela redefinição senha.
router.get('/redefinirsenha/:token',async(req,res)=>{
    const { token } = res.params
res.sendFile('https://venddiapi.herokuapp.com/web/redefinirSenha/'+token)
})
//Rota para redefinição de senha
router.post('/redefinirSenha/:token', async (req, res, ) => {
    const { token } = req.params
    const email = Funcao.verificatokensenha(token)
    const senhanova = req.body.novaSenha
    const password= await Funcao.cripto(senhanova)
    const user = await Banco.session(`SELECT id_user, senha FROM Vendi.user u where u.email= '${email}'`)
    if(user.rows[0]){
        await Banco.session(`UPDATE vendi.user SET senha=${password} WHERE email=${email};`)
        const iduser = await Banco.session(`SELECT id_user FROM Vendi.user u where u.email= '${email}' and u.senha= '${password};'`)
        if(iduser.rows[0].id_user>0){
            const token= Funcao.gerajwt(iduser.rows[0].id_user)
            if(token== false){
                res.status(401).json({token:[]})
              }
              res.status(200).json({token})
        }else{
            console.log({Erro: 'Erro ao gravar no banco de dados, por favor verifique os dados.'})
            res.status(401).json({token:[]})
        }
    }else{
        console.log({Erro: 'Email não encontrado'})
        res.status(401).json({token:[]})
    }
})
router.post('/avatar', async (req, res, ) => {
     
     const file = req.body.imagem
     var token = req.headers.authorization.replace(/^Bearer\s/, '')
     await Cadastro.avatar(token,file)
     token = Funcao.atualizajwt(token) 
     if(token.status == false){
         console.log(token.mensagem)
         res.status(401).json({token:[],perfil:[]}) 
     }else{
         const perfil = await Consulta.perfil(token)
         if(perfil.status == false){
             console.log(perfil.mensagem)
             res.status(401).json({token:[],perfil:[]})
         }else{
         res.status(200).json({token,perfil})
         }
     }
})
router.get('/uploads/:id', async (req, res) => {
    var { id } = req.params
    var filepath = 
        res.status(200).sendFile(filepath)
});

module.exports = router