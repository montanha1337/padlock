import express from 'express'
import Funcao from './functions'
import Consulta from '../Banco/migrations/consulta'
import Cadastro from '../Banco/migrations/insert'
import Delete from '../Banco/migrations/deletar'
import Editar from '../Banco/migrations/editar'

const router = express.Router()

router.post('/Inserir', async (req, res, ) => {
    var data = new Object()
    data.cpf=req.body.cpf
    data.telefone=req.body.telefone
    data.whatsapp=req.body.whatsapp
    data.rua=req.body.rua
    data.bairro=req.body.bairro
    data.cidade=req.body.cidade
    data.numero=req.body.numero
    data.cep=req.body.cep
    var result
    const token1=req.headers.authorization.replace(/^Bearer\s/, '');
    console.log({data: data,token: token1})
    if(data){
    const token = Funcao.atualizajwt(token1) 
    if(token.status== false){
        console.log(token.mensagem)
        res.status(401).json({token:null,result:null})
    }else{
        var verifica =await  Funcao.validacpf(data['cpf'])
        if(verifica == false){

            console.log('Erro: Cpf Invalido')
            res.status(401).json({token:null,result:null})
        }else{
            result = await Cadastro.cliente(token,data)
            if(result.status== false){
                console.log(result)
                if(result.id_cliente== null){
                    console.log("Erro: não é cliente")
                    res.status(200).json({token,result})
                }else{
                    res.status(200).json({token,result})
                }
            }else{
                res.status(200).json({token,result})
            }
        }
    }
}else{
    res.status(502).json(data)
}
})
router.get('/buscar', async (req, res, ) => {
    
    const token1=req.headers.authorization.replace(/^Bearer\s/, '');
    const token = Funcao.atualizajwt(token1) 
    if(token.status == false){
        console.log(anuncio.mensagem)
        res.status(401).json({token:null,result:null})
    }else{
        const result = await Consulta.cliente(token)
        res.status(200).json({token,result})
    }
    
})
router.post('/editar', async (req, res, ) => {
    var data = new Object()
    data.nome = req.body.nome
    data.cpf=req.body.cpf
    data.telefone=req.body.telefone
    data.whatsapp=req.body.whatsapp
    data.rua=req.body.rua
    data.bairro=req.body.bairro
    data.cidade=req.body.cidade
    data.numero=req.body.numero
    data.cep=req.body.cep
    const token1=req.headers.authorization.replace(/^Bearer\s/, '');
    const token = Funcao.atualizajwt(token1)
    if(token.status == false){
        console.log(token.mensagem)
        res.status(401).json({token:null,result:null})
    }else{
        const compare = await Consulta.cliente(token)
        console.log(compare)
        var result = await Editar.atualizaCliente('pessoa','cpf',data['cpf'],compare.cpf)
        result  = await Editar.atualizaCliente('user','nome',data['nome'],compare.nome)
        result  = await Editar.atualizaCliente('telefone','telefone',data['telefone'],compare.telefone)
        result = await Editar.atualizaCliente('telefone','whatsapp',data['whatsapp'],compare.whatsapp)
        result = await Editar.atualizaCliente('endereco','rua',data['rua'],compare.rua)
        result = await Editar.atualizaCliente('endereco','bairro',data['bairro'],compare.bairro)
        result = await Editar.atualizaCliente('endereco','cidade',data['cidade'],compare.cidade)
        result = await Editar.atualizaCliente('endereco','numero',data['numero'],compare.numero)
        result = await Editar.atualizaCliente('endereco','cep',data['cep'],compare.cep)
        result = await Consulta.cliente(token)
        res.status(200).json({token,result})
    }
})
router.delete('/deletar', async (req, res,) => {
    const token = req.headers.authorization.replace(/^Bearer\s/, '')
    const cliente = await Delete.cliente(token)
    if (cliente.status == false) {
        console.log(cliente.mensagem)
        res.status(200).json({ cliente: [] })
    } else {
        res.status(200).json({ cliente })
    }

})

module.exports = router