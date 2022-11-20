import express from 'express'
import ContatoControl from '../controller/contatoController'
import Framework from '../controller/functions'

const router = express.Router()

router.post('/inserir', async (req, res) => {
  try {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let contato = req.body.nome
  let pix = req.body.pix
  let tipo = req.body.tipo
  let inserir = await ContatoControl.inserir(token, contato, pix, tipo)
  res.status(inserir.status).json(inserir)
} catch (e) {
  let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
  res.status(conexao.status).json(conexao)
}
})

router.put('/editarNome', async (req, res) => {
  try {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let id =req.body.contato
  let nome = req.body.nome
  let deletar = await ContatoControl.EditarContato(token,id,nome)
  res.status(deletar.status).json(deletar)
} catch (e) {
  let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
  res.status(conexao.status).json(conexao)
}
})

router.post('/adicionarPix', async (req, res) => {
  try {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let contato = req.body.nome
  let pix = req.body.pix
  let tipo = req.body.tipo
  let inserir = await ContatoControl.adicionarPix(token, contato, pix, tipo)
  res.status(inserir.status).json(inserir)
} catch (e) {
  let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
  res.status(conexao.status).json(conexao)
}
})

router.post('/listarPix', async (req, res) => {
  try {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let contato = req.body.contato
  let listar = await ContatoControl.listar(token,contato)
  res.status(listar.status).json(listar)
} catch (e) {
  let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
  res.status(conexao.status).json(conexao)
}
})


router.delete('/deletar', async (req, res) => {
  try {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let nome =req.body.nome
  let deletar = await ContatoControl.excluirContato(token,nome)
  res.status(deletar.status).json(deletar)
} catch (e) {
  let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
  res.status(conexao.status).json(conexao)
}
})

router.delete('/deletarPix', async (req, res) => {
  try {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let nome =req.body.nome
  let pix =req.body.pix
  let deletar = await ContatoControl.excluirPix(token,nome,pix)
  res.status(deletar.status).json(deletar)
} catch (e) {
  let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
  res.status(conexao.status).json(conexao)
}
})

router.get('/listarContato', async (req, res) => {
  try {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let listar = await ContatoControl.listarContato(token)
  res.status(listar.status).json(listar)
} catch (e) {
  let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
  res.status(conexao.status).json(conexao)
}
})

module.exports = router