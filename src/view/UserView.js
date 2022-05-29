import express from 'express'
import UserControl from '../controller/userController'

const router = express.Router()

//#region CRUD

router.post('/inserir', async (req, res) => {
  const email = req.body.email
  const nome = req.body.nome
  const senha = req.body.senha
  let inserir = await UserControl.Validador("", nome, email, senha, "", "inserir")
  res.status(inserir.status).json(inserir)
  
})

router.post('/login', async (req, res) => {
  const email = req.body.email
  const senha = req.body.senha
  let login = await UserControl.Validador("", "", email, senha, "", "login")
  res.status(login.status).json(login)
})

router.put('/alteraSenha', async (req, res) => {
  const email = req.body.email
  const senha = req.body.senha
  const senhaAntiga= req.body.antiga
  const token = req.headers.authorization.replace(/^Bearer\s/, '');
  let altera = await UserControl.Validador(token, "", email, senha, senhaAntiga, "AlterarSenha")
  res.status(altera.status).json(altera)
})

router.delete('/excluirId', async (req, res) => {
  let id = req.headers.authorization.replace(/^Bearer\s/, '');
  let deleta = await UserControl.Validador(id, "", "", "", "", "deleteId")
  res.status(deleta.status).json(deleta)
})

router.get('/buscarUm', async (req, res) => {
  let id = req.headers.authorization.replace(/^Bearer\s/, '');
  let busca = await UserControl.Validador(id, "", "", "", "", "listarUm")
  res.status(busca.status).json(busca)
})

router.get('/atualizaToken', async (req, res) => {
  let token = req.headers.authorization.replace(/^Bearer\s/, '');
  let credencial = await UserControl.Validador(token, "", "", "", "", "atualizaToken")
  res.status(credencial.status).json(credencial)
})
//#endregion

//#region DESENVOLVIMENTO

router.post('/dev/senha', async (req, res) => {
  const senha = req.body.senha
  let testesenha = await UserControl.testeSenha(senha)
  res.status(testesenha.status).json(testesenha)
})

router.delete('/dev/excluirViaEmail', async (req, res) => {
  const email = req.body.email
  let encripta = await UserControl.excluirUm(email)
  res.status(encripta.status).json(encripta)
})

router.get('/dev/listar', async (req, res) => { //Lista Todos os usuarios (somente tem homologação)
  const email = req.body.email
  const senha = req.body.senha
  let listar = await UserControl.listar(email)
  res.status(listar.status).json(listar)
})

//#endregion

module.exports = router