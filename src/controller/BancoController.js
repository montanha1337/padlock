import BancoModel from '../model/Banco';
import BancoApi from '../client.web/bancoapi'
import ConfigControl from './config'


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
    banco = await listar()

    return banco

}
async function listar() {
    let banco = new Object()
    banco.dados = await BancoModel.find()
    banco.tamanho = banco.dados.length
    banco.bd= await ConfigControl.totalBanco()
    if(banco.tamanho==banco.bd){
        return Funcao.padraoSucesso(banco.dados)
    }else{
        await excluir()
        await inserir()
        banco.lista = await listar()
        return padraoSucesso(banco.lista)
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
        return Funcao.padraoSucesso(banco)
    } else {
        await inserir()
        banco = await BancoModel.findOne({ code })
        return Funcao.padraoSucesso(banco)
    }
}


module.exports = { inserir, listar, excluir, listarUm }