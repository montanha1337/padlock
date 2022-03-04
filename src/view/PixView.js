import express from 'express'
import PixControl from '../controller/pixController'

const router = express.Router()

router.post('/inserir',async (req,res)=>{
    const idUser = req.body.token
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
router.post('/listarpix',async (req,res)=>{
  const token = req.body.token
  const email = req.body.email
  let listar =await PixControl.listar(token,email)
  if(listar.status == false){
    res.status(400).json(listar.mensagem)
  }else{    
    res.status(200).json(listar)
  }
})
router.delete('/deletar',async (req,res)=>{
  const token = req.body.token
  const email = req.body.email
  const pix   = req.body.pix
  let listar =await PixControl.excluirId(token,email,pix)
  if(listar.status == false){
    res.status(400).json(listar.mensagem)
  }else{    
    res.status(200).json(listar)
  }
})


module.exports = router