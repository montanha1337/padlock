import BancoModel from '../model/Banco';
import BancoApi from '../client.web/bancoapi'
import ConfigControl from './config'
import Framework from './functions'

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
    try {
        let banco = new Object()
        banco.dados = await BancoModel.find()
        banco.tamanho = banco.dados.length
        banco.bd = await ConfigControl.totalBanco()
        if (banco.tamanho != banco.bd) {
            await excluir()
            await inserir()
        }        
        return Framework.PadronizarRetorno("sucesso", 200, banco.dados)
    } catch (e) {
        return Framework.PadronizarRetorno("erro", 400, `não foi possivel listar bancos: ${e.message}`)
    }
}

async function excluir() {
    let banco = new Object()
    banco.dados = await BancoModel.deleteMany()
    return banco
}

async function listarUm(code) {
    let banco = await BancoModel.findOne({ code })
    if (banco) {
        return Framework.PadronizarRetorno("sucesso", 200, banco)
    } else {
        await inserir()
        banco = await BancoModel.findOne({ code })
        return Framework.PadronizarRetorno("sucesso", 200, banco)
    }
}

module.exports = { inserir, listar, excluir, listarUm }