import express  from  'express'
import Banco    from  '../Banco/connect'
import Funcao   from  './functions'
import Database from  '../Banco/migrations/database'
import Delete from '../Banco/migrations/deletar'
import Editar from '../Banco/migrations/editar'
import Consulta from '../Banco/migrations/consulta'


const router = express.Router()


 // rota de teste servidor
 router.get('/testeServer',(req,res)=>{
    const descricao ='Acessado backend!!!'
    res.json({descricao})
  })

// rota de teste banco de dados
router.get('/testeConexaoBanco', async (req, res, ) => {
    const result = await Banco.session("select exists (select * from pg_catalog.pg_namespace where nspname = 'vendi');")
    if(result.rows[0].exists=false){
      await Funcao.criaBancoPadrao()
      const conexao = await Funcao.verificaconexao(5)
      res.json(conexao)
  }
    else{
      await Funcao.atualizaBanco()

      const texto= await Funcao.verificaconexao(2)
      res.json(texto)
    }
    
})
router.get('/testegeolocalizacao', async (req, res, ) => {
  const latitude = req.body.latitude
  const longitude = req.body.longitude
  const result = await Consulta.analizaLatitude(latitude, longitude)
  res.json(result)
})

router.get('/rotasparaimportacao', async (req, res, ) => {
  res.redirect('https://drive.google.com/drive/folders/1Dn4XIr-qcVQpSqlT6aqseXfNscRXqllu?usp=sharing')
})

 // rota de deletar de banco de dados.
 router.get('/deletaBanco',async(req,res)=>{
  const banco= await Banco.session("SELECT count(nspname) FROM pg_catalog.pg_namespace;")

  if(result.rows[0].count==4){
    const conexao =await Funcao.verificaconexao(3) 
    Database.deletaschema()      
    Delete.deleteArquivos("avatar")
    Delete.deleteArquivos("anuncio")
   

    res.json(conexao)
  }else{
  }
})
router.get('/testeToken', async (req, res, ) => {
  const Bearer = req.body.token
  const id= Funcao.verificajwt(Bearer) 
  res.json(id)
})


router.get('/AtualizaToken',async(req,res)=>{
  const atualizatoken = req.headers.authorization.replace(/^Bearer\s/, '');
  const token = await Funcao.atualizajwt(atualizatoken)
 if(token== false){
  res.status(401).json({token:[]})
}
res.status(200).json({token})
})
//testa o envio de email
router.get('/enviaEmail',async(req,res)=>{
      const nome = req.body.assunto;
      const email = req.body.email;
      const mensagem = req.body.texto;
      
     const enviarEmail = Funcao.enviaremail(email, nome,mensagem)
     res.status(200).json({enviarEmail})

  })
  router.get('/testeStringBanco', async (req, res, ) => {
  const tabela = req.body.tabela
  const campo = req.body.campo
  const valor = req.body.valor
  const campoBusca = req.body.campoBusca
  const valorBusca = req.body.valorBusca  
  const result= await Editar.updateTable(tabela,campo,valor,campoBusca, valorBusca)
  res.status(200).json(result)

})
module.exports = router