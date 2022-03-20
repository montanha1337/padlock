import express from 'express'
import ContatoControl from '../controller/contatoController'

const router = express.Router()

router.post('/inserir', async (req, res) => {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let contato = req.body.nome
  let pix = req.body.pix
  let tipo = req.body.tipo
  let inserir = await ContatoControl.inserir(token, contato, pix, tipo)
  if (inserir.status == false) {
    res.status(400).json(inserir.mensagem)
  } else {
    res.status(200).json(inserir)
  }
})
router.post('/adicionarpix', async (req, res) => {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let contato = req.body.nome
  let pix = req.body.pix
  let tipo = req.body.tipo
  let inserir = await ContatoControl.adicionarPix(token, contato, pix, tipo)
  if (inserir.status == false) {
    res.status(400).json(inserir.mensagem)
  } else if (inserir == true) {
    res.status(200).json("Processo realizado Com Sucesso")
  }
})
router.get('/listar', async (req, res) => {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let listar = await ContatoControl.listar(token)
  if (listar.status == false) {
    res.status(400).json(listar.mensagem)
  }else{
  res.status(200).json(listar)
  }
})

router.delete('/deletar', async (req, res) => {

})

router.get('/listar/:code', async (req, res) => {

})



module.exports = router