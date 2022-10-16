import BancoModel from '../model/Banco';
import BancoApi from '../client.web/bancoapi'
import ConfigControl from './config'
import Funcao from './functions'

async function inserir() {
    let nome
    let code
    let fullNome
    let banco = new Object()
    let bancos = await BancoApi.buscarBancos()
    let pesquisa
    banco.dados = bancos
    banco.tamanho = bancos.length
    for (let i = 0; i < banco.tamanho; i++) {
        nome = banco.dados[i].name
        code = banco.dados[i].code
        fullNome = banco.dados[i].fullName
        pesquisa = await BancoModel.findOne({ code })
        if (!pesquisa) {
            bancos = await BancoModel.create({ nome, code, fullNome })
        }
    }
    await ConfigControl.inserirTotalBanco(banco.tamanho)
    banco = await listar()
    return banco
}

async function listar() {
    let banco = new Object()
    banco.dados = await BancoModel.find()
    banco.tamanho = banco.dados.length
    banco.bd = await ConfigControl.totalBanco()
    if (banco.tamanho != banco.bd) {
        await excluir()
        await inserir()
    }
    banco.dados = await listar()
    return Funcao.PadronizarRetorno("sucesso", 200, banco.dados)
}

async function excluir() {
    let banco = new Object()
    banco.dados = await BancoModel.deleteMany()
    return banco
}

async function listarUm(code) {
    let banco = await BancoModel.findOne({ code })
    if (banco) {
        return Funcao.PadronizarRetorno("sucesso", 200, banco)
    } else {
        await inserir()
        banco = await BancoModel.findOne({ code })
        return Funcao.PadronizarRetorno("sucesso", 200, banco)
    }
}

module.exports = { inserir, listar, excluir, listarUm }