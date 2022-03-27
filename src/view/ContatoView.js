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

router.put('/editarNome', async (req, res) => {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let id =req.body.contato
  let nome = req.body.nome
  let deletar = await EditarContato(token.id,nome)
  res.status(deletar.status).json(deletar)
})

router.post('/adicionarPix', async (req, res) => {
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
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let id =req.body.contato
  let deletar = await excluirContato(token,id)
  res.status(deletar.status).json(deletar)
})

router.delete('/deletarPix', async (req, res) => {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let pix =req.body.pix
  let deletar = await excluirPix(token,pix)
  res.status(deletar.status).json(deletar)
})


module.exports = router