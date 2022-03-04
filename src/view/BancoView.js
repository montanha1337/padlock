import express from 'express'
import BancoControl from '../controller/BancoController'

const router = express.Router()

router.get('/inserir',async (req,res)=>{
    const bancos = await BancoControl.inserir()
    let mensagem = bancos.mensagem
    res.status(200).json({mensagem})
    
  })
  router.get('/listar',async (req,res)=>{
    let bancos = new Object() 
    bancos= await BancoControl.listar()
    //bancos.tamanho = Config.tamanhoBanco()
    if(bancos.tamanho == 316){
    res.status(200).json(bancos.dados)
    }else{
      bancos.api = await BancoControl.inserir()
      res.status(200).json(bancos.api)
    }
  })

  router.delete('/deletar',async (req,res)=>{
    let bancos = await BancoControl.excluir()
    bancos = await BancoControl.listar()
    res.status(200).json({tamanho:bancos.tamanho})
  })

  router.get('/listar/:code',async (req,res)=>{
    const code = req.params.code
    let banco = await BancoControl.listarUm(code)
    res.status(200).json(banco)
    


  })
  


module.exports = router