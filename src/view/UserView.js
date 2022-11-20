import express from 'express'
import UserControl from '../controller/userController'
import Framework from '../controller/functions'

const router = express.Router()

//#region CRUD

router.post('/cadastro', async (req, res) => {
  try {
    const email = req.body.email
    const nome = req.body.nome
    const senha = req.body.senha
    let inserir = await UserControl.Validador("", nome, email, senha, "", "inserir")
    res.status(inserir.status).json(inserir)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }

})

router.post('/login', async (req, res) => {
  try {
    const email = req.body.email
    const senha = req.body.senha
    let login = await UserControl.Validador("", "", email, senha, "", "login")
    res.status(login.status).json(login)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

router.put('/alteraSenha', async (req, res) => {
  try {
    const email = req.body.email
    const senha = req.body.senha
    const senhaAntiga = req.body.antiga
    const token = req.headers.authorization
    let altera
    if (!token) {
      altera = await UserControl.Validador("", "", email, senha, "", "AlterarSenha")
    } else {
      token.replace(/^Bearer\s/, '')
      altera = await UserControl.Validador(token, "", email, senha, senhaAntiga, "AlterarSenha")
    }
    res.status(altera.status).json(altera)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

router.delete('/excluirId', async (req, res) => {
  try {
    let id = req.headers.authorization.replace(/^Bearer\s/, '');
    let deleta = await UserControl.Validador(id, "", "", "", "", "deleteId")
    res.status(deleta.status).json(deleta)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

router.get('/buscarUm', async (req, res) => {
  try {
    let id = req.headers.authorization.replace(/^Bearer\s/, '');
    let busca = await UserControl.Validador(id, "", "", "", "", "listarUm")
    res.status(busca.status).json(busca)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

router.post('/atualizaToken', async (req, res) => {
  try {
    let token = req.body.token
    if (!token)
      token = req.headers.authorization

    if (token) {
      let credencial = await UserControl.Validador(token, "", "", "", "", "atualizaToken")
      res.status(credencial.status).json(credencial)
    } else {
      let conexao = Framework.PadronizarRetorno("erro", 400, `Token inválido`)
      res.status(conexao.status).json(conexao)
    }
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }

})
//#endregion

//#region FERRAMENTAS DESENVOLVEDOR

router.delete('/dev/excluirViaEmail', Framework.adminOnly, async (req, res) => {
  try {
    const email = req.body.email
    let encripta = await UserControl.excluirUm(email)
    res.status(encripta.status).json(encripta)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

router.get('/dev/listar', Framework.adminOnly, async (req, res) => { //Lista Todos os usuarios (somente tem homologação)
  try {
    let listar = await UserControl.listar()
    res.status(listar.status).json(listar)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

//#endregion

module.exports = router