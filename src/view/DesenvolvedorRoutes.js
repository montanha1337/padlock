import express from 'express'
import Framework from '../controller/functions'
import BancoApi from '../client.web/bancoapi'
import ConfigControl from '../controller/config'
import SenhaAntiga from '../controller/SenhaAntigaController'

const router = express.Router()

//#region TESTE DE ESTABILIDADE
router.get('/testeServer', (req, res) => {
  try {
    let conexao = Framework.PadronizarRetorno("sucesso", 200, "Conexão estabelecida com sucesso.")
    res.status(conexao.status).json(conexao)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, "Não foi possivel retornar requisição")
    res.status(conexao.status).json(conexao)
  }
})
//#endregion

//#region PAGINAS DE INTERACTIVIDADE
router.get('/rotasparaimportacao', async (req, res,) => {
  res.redirect('https://drive.google.com/drive/folders/1-1Wf1jpu1xFKtdh2wmUPzpW1nrCAQgtA?usp=sharing')
})

router.get('/ferramentasDoDesenvolvedor', async (req, res,) => {
  res.redirect('https://drive.google.com/drive/folders/15elduxagVHk_4bNguYmTWVMfVeGu3iLp?usp=sharing')
})
//#endregion

//#region TESTE DE ENCRIPTAÇÃO DE RETORNO
router.post('/manipulaToken', async (req, res,) => {
  try {
    const dado = req.body.dado
    const rotina = req.body.rotina
    const retorno = await Framework.ManipularToken(rotina, dado)
    res.status(retorno.status).json(retorno)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, "Não foi possivel retornar requisição.")
    res.status(conexao.status).json(conexao)
  }
})
//#endregion

//#region MENU CONFIGURAÇÕES
router.get('/AtualizaBanco', Framework.adminOnly, async (req, res) => {
  const bancos = await BancoApi.buscarBancos()
  res.json(bancos)
})

router.post('/config/secreto', Framework.adminOnly, async (req, res) => {
  let palavra = req.body.palavra
  await ConfigControl.inserirPalavra(palavra)
  palavra = await ConfigControl.palavra()
  res.status(200).json({ palavra })
})

router.post('/config/inserirtipopix', Framework.adminOnly, async (req, res) => {
  let tipo = req.body.tipo
  await ConfigControl.inserirTipoPix(tipo)
  tipo = await ConfigControl.listarTipoPix()
  res.status(200).json(tipo)
})

router.get('/config/listartipopix', async (req, res) => {
  let tipo = await ConfigControl.listarTipoPix()
  res.status(200).json(tipo)
})
//#endregion

//#region TESTE DE BIBLIOTECA
router.post('/historicoDeSenha', Framework.adminOnly, async (req, res) => {
  let email = req.body.email
  let senha = req.body.senha
  let resposta
  resposta = await SenhaAntiga.SenhaAntiga(email, senha)
  res.status(resposta.status).json(resposta)
})

router.post('/validaDado', async (req, res) => {
  try {
    const dado = req.body.dado
    const tipoDado = req.body.tipo
    const retorno = await Framework.ValidarDado(tipoDado, dado)
    res.status(retorno.status).json(retorno)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})

router.post('/manipulaDado', async (req, res) => {
  try {
    const dado = req.body.dado
    const rotina = req.body.rotina
    const retorno = await Framework.ManipularDado(rotina, dado)
    res.status(retorno.status).json(retorno)
  } catch (e) {
    let conexao = Framework.PadronizarRetorno("erro", 400, `Não foi possivel retornar requisição: ${e.message}`)
    res.status(conexao.status).json(conexao)
  }
})
//#endregion

module.exports = router