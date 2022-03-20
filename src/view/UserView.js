import express from 'express'
import UserControl from '../controller/userController'

const router = express.Router()

router.post('/inserir', async (req, res) => {
  const email = req.body.email
  const nome = req.body.nome
  const senha = req.body.senha
  console.log(email, nome, senha)
  let inserir = await UserControl.inserir(nome, email, senha)

  if (inserir.status == false) {
    res.status(400).json(inserir.mensagem)
  } else {
    res.status(200).json(inserir)
  }
})

router.delete('/excluir', async (req, res) => {
  const email = req.body.email
  const nome = req.body.nome
  const senha = req.body.senha
  let encripta = await UserControl.excluirUm(nome, email, senha)

  res.status(200).json({ encripta })
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
router.post('/senha', async (req, res) => {
  const senha = req.body.senha
  let login = await UserControl.testeSenha(senha)
  if (login.status == false) {
    res.status(400).json(login.mensagem)
  } else {
    res.status(200).json(login)
  }
})


module.exports = router