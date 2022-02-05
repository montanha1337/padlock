import express  from  'express'
import Funcao   from  './functions'


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