import express from 'express'
import BancoControl from '../controller/BancoController'

const router = express.Router()

router.get('/inserir', async (req, res) => {
  try {
    const bancos = await BancoControl.inserir()
    let mensagem = bancos.mensagem
    res.status(200).json({ mensagem })
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

router.get('/listar', async (req, res) => {
  try {
    let bancos = await BancoControl.listar()
    res.status(bancos.status).json(bancos)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

router.delete('/deletar', async (req, res) => {
  try {
    let bancos = await BancoControl.excluir()
    bancos = await BancoControl.listar()
    res.status(200).json({ tamanho: bancos.tamanho })
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

router.get('/listar/:code', async (req, res) => {
  try {
    const code = req.params.code
    let banco = await BancoControl.listarUm(code)
    res.status(banco.status).json(banco)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

module.exports = router