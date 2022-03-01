import express from 'express'
import UserControl from '../controller/userController'

const router = express.Router()

router.post('/inserir',async (req,res)=>{
    const email = req.body.email
    const nome = req.body.nome
    const senha = req.body.senha
    let inserir = await UserControl.inserir(nome,email,senha)

    if(inserir.status == false){
      res.status(400).json(inserir.mensagem)
    }else{    
      res.status(200).json(inserir)
    }
  })

  router.delete('/excluir',async (req,res)=>{
    const email = req.body.email
    const nome = req.body.nome
    const senha = req.body.senha
    let encripta = await UserControl.excluirUm(nome,email,senha)
    
    res.status(200).json({encripta})
  })

  router.get('/login',async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha
    let login = await UserControl.login(email,senha)
    if(login.status == false){
      res.status(400).json(login.mensagem)
    }else{    
      res.status(200).json(login)
    }
  })
  router.get('/dev/listar',async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha
    let listar = await UserControl.listar(email)
    if(listar.status == false){
      res.status(400).json(listar.mensagem)
    }else{    
      res.status(200).json(listar)
    }
  })
  router.delete('/excluirId',async (req,res)=>{
    let id = req.body.id
       let deleta = await UserControl.excluirId(id)
    
    res.status(200).json({"usuario deletado": deleta})
  })



module.exports = router