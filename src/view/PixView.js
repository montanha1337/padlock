import express from 'express'
import PixControl from '../controller/pixController'

const router = express.Router()


//#region CRUD
router.post('/inserir', async (req, res) => {
  try {
    const idUser = req.headers.authorization.replace(/^Bearer\s/, '');
    const email = req.body.email
    const pix = req.body.pix
    const idBanco = req.body.idBanco
    const tipo = req.body.tipo
    let inserir = await PixControl.inserir(idUser, email, pix, idBanco, tipo)
    res.status(inserir.status).json(inserir)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

router.post('/listar', async (req, res) => {
  try {
    const token = req.headers.authorization.replace(/^Bearer\s/, '');
    const email = req.body.email
    let listar = await PixControl.listar(token, email)
    res.status(listar.status).json(listar)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

router.post('/listarum', async (req, res) => {
  try {
    const token = req.headers.authorization.replace(/^Bearer\s/, '');
    const email = req.body.email
    const pix = req.body.pix
    let listar = await PixControl.listarUm(token, email, pix)
    res.status(listar.status).json(listar)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

router.delete('/deletar', async (req, res) => {
  try {
    const token = req.headers.authorization.replace(/^Bearer\s/, '');
    const email = req.body.email
    const pix = req.body.pix
    let deletar = await PixControl.excluirId(token, email, pix)
    res.status(deletar.status).json(deletar)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

router.put('/editar', async (req, res) => {
  try {
    const token = req.headers.authorization.replace(/^Bearer\s/, '');
    const email = req.body.email
    const pixAntigo = req.body.pixAntigo
    const pixNovo = req.body.pixNovo
    const tipo = req.body.tipo
    const banco = req.body.banco
    let editar = await PixControl.editar(token, email, pixAntigo, pixNovo, tipo, banco)
    res.status(editar.status).json(editar)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})
//#endregion

//#region FERRAMENTAS
router.post('/validapix', async (req, res) => {
  try {
    const pix = req.body.pix
    const tipo = req.body.tipo
    let valida = await PixControl.testePix(pix, tipo)
    res.status(valida.status).json(valida)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

router.get('/listartipopix', async (req, res) => {
  try {
    let tipo = await PixControl.listarTipoPix()
    res.status(tipo.status).json(tipo)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})
//#endregion

module.exports = router