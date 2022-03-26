import express from 'express'
import UserControl from '../controller/userController'

const router = express.Router()

//#region CRUD

router.post('/inserir', async (req, res) => {
  const email = req.body.email
  const nome = req.body.nome
  const senha = req.body.senha
  let inserir = await UserControl.inserir(nome, email, senha)

  if (inserir.status == false) {
    res.status(400).json(inserir.mensagem)
  } else {
    res.status(200).json(inserir)
  }
})

router.post('/login', async (req, res) => {
  const email = req.body.email
  const senha = req.body.senha
  let login = await UserControl.login(email, senha)
  if (login.status == false) {
    res.status(400).json(login.mensagem)
  } else {
    res.status(200).json(login)
  }
})

router.put('/alteraSenha', async (req, res) => {
  const email = req.body.email
  const senha = req.body.senha
  let altera = await UserControl.AlterarSenha(email, senha)
  if (altera.status == false) {
    res.status(400).json(altera.mensagem)
  } else {
    res.status(200).json(altera)
  }
})

router.delete('/excluirId', async (req, res) => {
  let id = req.headers.authorization.replace(/^Bearer\s/, '');
  let deleta = await UserControl.excluirId(id)

  res.status(200).json({ "usuario deletado": deleta })
})

router.get('/buscarUm', async (req, res) => {
  let id = req.headers.authorization.replace(/^Bearer\s/, '');
  let busca = await UserControl.listarUm(id)

  res.status(200).json(busca)
})

//#endregion

//#region DESENVOLVIMENTO

router.post('/dev/senha', async (req, res) => {
  const senha = req.body.senha
  let testesenha = await UserControl.testeSenha(senha)
  if (testesenha.status == false) {
    res.status(400).json(testesenha.mensagem)
  } else {
    res.status(200).json(testesenha)
  }
})

router.delete('/dev/excluirViaEmail', async (req, res) => {
  const email = req.body.email
  let encripta = await UserControl.excluirUm(email)

  res.status(200).json({ encripta })
})

router.get('/dev/listar', async (req, res) => { //Lista Todos os usuarios (somente tem homologação)
  const email = req.body.email
  const senha = req.body.senha
  let listar = await UserControl.listar(email)
  if (listar.status == false) {
    res.status(400).json(listar.mensagem)
  } else {
    res.status(200).json(listar)
  }
})

//#endregion

module.exports = router