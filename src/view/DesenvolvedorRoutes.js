import express  from  'express'
import Funcao   from  '../controller/functions'
import BancoApi from '../client.web/bancoapi'
import ConfigControl from '../controller/config'


const router = express.Router()


 // rota de teste servidor
 router.get('/testeServer',(req,res)=>{
    const descricao ='Acessado backend!!!'
    res.json({descricao})
  })
  router.get('/rotasparaimportacao', async (req, res, ) => {
    res.redirect('https://drive.google.com/drive/folders/1qwFLk3gBIGYHZIlMwsk_FkEDkdB4oA3Z?usp=sharing')
  })
  router.get('/ferramentasDoDesenvolvedor', async (req, res, ) => {
    res.redirect('https://drive.google.com/drive/folders/15elduxagVHk_4bNguYmTWVMfVeGu3iLp?usp=sharing')
  })


router.get('/testeToken', async (req, res, ) => {
  const Bearer = req.body.token
  const conteudo= await Funcao.verificajwt(Bearer) 
  res.json({conteudo})
})


router.get('/AtualizaToken',async(req,res)=>{
  const atualizatoken = req.headers.authorization.replace(/^Bearer\s/, '');
  const token = await Funcao.atualizajwt(atualizatoken)
 if(token== false){
  res.status(401).json({token:[]})
}
res.status(200).json({token})
})

router.get('/geraToken',async(req,res)=>{
  const conteudo = req.body.informacao;
  const token = await Funcao.gerajwt(conteudo)
 if(token == false){
  res.status(401).json({token:[]})
}else
res.status(200).json({token})
})

router.get('/AtualizaBanco',async(req,res)=>{
  const bancos = await BancoApi.buscarBancos()
  res.json(bancos)
})

router.post('/config/secreto',async(req,res)=>{
  let palavra = req.body.palavra
  await ConfigControl.inserirPalavra(palavra)
  palavra = await ConfigControl.palavra()
  res.status(200).json({palavra})
})
router.post('/config/totalbanco',async(req,res)=>{
  let total = req.body.total
  await ConfigControl.inserirTotalBanco(total)
  total = await ConfigControl.totalBanco()
  res.status(200).json(total)
})
router.post('/config/inserirtipopix',async(req,res)=>{
  let tipo = req.body.tipo
  await ConfigControl.inserirTipoPix(tipo)
  tipo = await ConfigControl.listarTipoPix()
  res.status(200).json(tipo)
})
router.get('/config/listartipopix',async(req,res)=>{
  let tipo = await ConfigControl.listarTipoPix()
  res.status(200).json(tipo)
})



module.exports = router