import express from 'express'
import PixControl from '../controller/pixController'
import ConfigControl from '../controller/config'

const router = express.Router()

router.post('/inserir',async (req,res)=>{
    const idUser = req.headers.authorization.replace(/^Bearer\s/, '');
    const email = req.body.email
    const pix = req.body.pix
    const idBanco = req.body.idBanco
    const tipo = req.body.tipo
    let inserir = await PixControl.inserir(idUser,email,pix,idBanco,tipo)
    if(inserir.status == false){
      res.status(400).json(inserir.mensagem)
    }else{    
      res.status(200).json(inserir)
    }
  })
router.post('/listar',async (req,res)=>{
  const token = req.headers.authorization.replace(/^Bearer\s/, '');
  const email = req.body.email
  let listar =await PixControl.listar(token,email)
  if(listar.status == false){
    res.status(400).json(listar.mensagem)
  }else{    
    res.status(200).json(listar)
  }
})
router.post('/listarum',async (req,res)=>{
  const token = req.headers.authorization.replace(/^Bearer\s/, '');
  const email = req.body.email
  const pix   = req.body.pix
  let listar =await PixControl.listarUm(token,email,pix)
  if(listar.status == false){
    res.status(400).json(listar.mensagem)
  }else{    
    res.status(200).json(listar)
  }
})
router.delete('/deletar',async (req,res)=>{
  const token = req.headers.authorization.replace(/^Bearer\s/, '');
  const email = req.body.email
  const pix   = req.body.pix
  let listar =await PixControl.excluirId(token,email,pix)
  if(listar.status == false){
    res.status(400).json(listar.mensagem)
  }else{    
    res.status(200).json(listar)
  }
})
router.put('/editar',async (req,res)=>{
  const token = req.headers.authorization.replace(/^Bearer\s/, '');
  const email = req.body.email
  const pixAntigo   = req.body.pixAntigo
  const pixNovo = req.body.pixNovo
  const tipo = req.body.tipo
  const banco = req.body.banco
  let listar =await PixControl.editar(token,email,pixAntigo,pixNovo,tipo,banco)
  if(listar.status == false){
    res.status(400).json(listar.mensagem)
  }else{    
    res.status(200).json(listar)
  }
})

router.post('/validapix',async (req,res)=>{
  const pix   = req.body.pix
  const tipo  = req.body.tipo
  let listar =await PixControl.testePix(pix,tipo)
      
    res.status(200).json({listar})
  
})
router.get('/listartipopix',async(req,res)=>{
  let tipo = await ConfigControl.listarTipoPix()
  res.status(200).json(tipo)
})




module.exports = router