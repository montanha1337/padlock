import express from 'express'
import ContatoControl from '../controller/contatoController'

const router = express.Router()

router.post('/inserir', async (req, res) => {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let contato = req.body.nome
  let pix = req.body.pix
  let tipo = req.body.tipo
  let inserir = await ContatoControl.inserir(token, contato, pix, tipo)
  res.status(inserir.status).json(inserir)
})

router.post('/adicionarpix', async (req, res) => {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let contato = req.body.nome
  let pix = req.body.pix
  let tipo = req.body.tipo
  let inserir = await ContatoControl.adicionarPix(token, contato, pix, tipo)
  res.status(inserir.status).json(inserir)
})

router.get('/listar', async (req, res) => {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let listar = await ContatoControl.listar(token)
  res.status(listar.status).json(listar)
})

router.delete('/deletar', async (req, res) => {
  res.status(deletar.status).json(deletar)
})

router.get('/listar/:code', async (req, res) => {
  res.status(listar.status).json(listar)
})

module.exports = router