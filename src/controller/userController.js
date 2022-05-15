import Funcao from './functions'
import UserModel from '../model/user'
import LogControl from './LogController'
import AntigaControl from './SenhaAntigaController'

//#region CRUD

async function inserir(nome, email, senha, senhaEncripta) {
    let result
    result = await login(email, senha)
    if (result.message == "Usuário não cadastrado") {
        nome = await Funcao.encripta(nome)
        await UserModel.create({ email, nome, senha: senhaEncripta })
        result = await login(email, senha)
        return result
    } else {
        return result
    }
}

async function login(email, senha) {
    let oSenhaBd
    let oBuscarUser
    let token
    oBuscarUser = await UserModel.find({ email })
    if (oBuscarUser == "") {
        return Funcao.padraoErro("Usuário não cadastrado")
    } else {
        oSenhaBd = await Funcao.verificajwt(oBuscarUser[0].senha)
        if (oSenhaBd == false) {
            return Funcao.padraoErro("Senha Expirada")
        }
        if (oSenhaBd == senha) {
            token = await Funcao.gerajwt(oBuscarUser[0]._id)
            await LogControl.deleta(email)
            return Funcao.padraoSucesso({ token })
        } else {
            await LogControl.InserirLog(email)
            return Funcao.padraoErro("Senha Incorreta")
        }
    }
}

async function AlterarSenha(email, senha, senhaAntiga) {
    let login = await login(email, senha)
    if (login.status == 200) {
        return login
    } else if (login.message == "Senha Incorreta" || login.message == "Senha Expirada") {
        let antiga = AntigaControl.senhaAntiga(senhaAntiga)
        if(antiga.status==400){
            return antiga
        }
        let result = await UserModel.findOne({ email })
        if (result) {
            await UserModel.findByIdAndUpdate({ _id: result._id }, { senha: valida.result.senhacripta })
            login = await login(email, senha)
            return login
        }
    }
}

async function excluirId(user) {
    let email = await UserModel.findById(user)
    let result = await UserModel.findByIdAndDelete(user)
    await AntigaControl.DeletaAntiga(email.email)
    return Funcao.padraoSucesso(result)
}

async function listarUm(user) {
    let formata = new Object();
    user = await UserModel.findById(user)
    formata.id = user[0]._id
    formata.nome= await Funcao.verificajwt(user[0].nome)
    formata.email = user[0].email
    return Funcao.padraoSucesso(formata)
}

//#endregion

//#region DESENVOLVIMENTO
async function testeSenha(senha) {
    senha = await Funcao.validaSenha(senha)
    return senha
}

async function excluirUm(email) {
    let result = await UserModel.findOneAndDelete({ email })
    return result
}

async function listar() {
    let result = await UserModel.find({})
    if (result) {
        return result
    } else {
        return Funcao.padraoErro("Lista Vazia")
    }
}

//#endregion


async function Validador(token, nome, email, senha, senhaAntiga, rota) {
    let user = await Funcao.verificajwt(token)
    let testeEmail = Funcao.validaEmail(email)
    let testeSenha = await Funcao.validaSenha(senha)
    let historicoSenha = await AntigaControl.SenhaAntiga(email, senha)
    let logExp = await LogControl.ValidaAcesso(email)
    let result
    let atualizaToken
    if (user == false && token != '') {
        return Funcao.padraoErro("Credencial invalida!!")
    } else {
        atualizaToken = await Funcao.atualizajwt(token)
    }
    if (email != '' && testeEmail.status == 400) {
        return testeEmail
    }
    if (senha != '' && testeSenha.status == 400) {
        return testeSenha
    }
    if (historicoSenha.status == 400 && rota != "login" && email != '' && senha != '') {
        return historicoSenha
    }
    if (email != '' && logExp.status == 400) {
        return logExp
    }

    switch (rota) {
        case "inserir":
            await LogControl.deleta(email)
            await AntigaControl.SenhaAntiga(email, senha)
            result = await inserir(nome, email, senha)
            break;
        case "login":
            result = await login(email, senha)
            break;
        case "AlterarSenha":
            result = await LogControl.deleta(email)
            await AntigaControl.SenhaAntiga(email, senha)
            await AlterarSenha(email, senha, senhaAntiga)
            break;
        case "deleteId":
            await LogControl.deleta(email)
            await AntigaControl.deletaAntiga(email)
            result = await excluirId(user)
            break
        case "listarUm":
            await listarUm(user)
            break;
        case "atualizaToken":
            result = Funcao.padraoSucesso(atualizaToken)
            break;
        default:
            return padraoErro("[Api] Erro ao informar a rota.")
    }
    return result
}


module.exports = { Validador, excluirUm, listar, listarUm, testeSenha }