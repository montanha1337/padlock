import express  from  'express'
import Funcao   from  '../controller/functions'


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
  const conteudo= Funcao.verificajwt(Bearer) 
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

module.exports = router