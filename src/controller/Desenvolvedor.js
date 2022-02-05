import express  from  'express'
import Funcao   from  './functions'


const router = express.Router()


 // rota de teste servidor
 router.get('/testeServer',(req,res)=>{
    const descricao ='Acessado backend!!!'
    res.json({descricao})
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

module.exports = router