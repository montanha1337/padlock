import Funcao from './functions'
import UserModel from '../model/user'
import LogControl from './LogController'
import AntigaControl from './SenhaAntigaController'

//#region CRUD

async function inserir(nome, email, senha, senhaEncripta) {
    let result
    let historicoSenha
    result = await login(email, senha)
    if (result.message == "Usuário não cadastrado") {
        historicoSenha = await AntigaControl.SenhaAntiga(email, senha)
        if (historicoSenha.status == 400) {
            return historicoSenha
        }
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
    oBuscarUser = await UserModel.findOne({ email })
    if (oBuscarUser == "" || oBuscarUser == null) {
        return Funcao.padraoErro("Usuário não cadastrado")
    } else {
        oSenhaBd = await Funcao.verificajwt(oBuscarUser.senha)
        if (oSenhaBd == false) {
            return Funcao.padraoErro("Senha Expirada")
        }
        if (oSenhaBd == senha) {
            token = await Funcao.gerajwt(oBuscarUser._id)
            await LogControl.deleta(email)
            return Funcao.padraoSucesso({ token })
        } else {
            await LogControl.InserirLog(email)
            return Funcao.padraoErro("Senha Incorreta")
        }
    }
}

async function AlterarSenha(email, senha, senhaAntiga) {
    let acesso
    let senhaEncripta = await Funcao.geraSenha(senha)
    if (senhaAntiga == '' || senhaAntiga == null || senhaAntiga == undefined) {
        acesso = await login(email, senha)
        if (acesso.message == "Senha Expirada") {
            let result = await UserModel.findOne({ email })
            if (result) {
                await UserModel.findByIdAndUpdate({ _id: result._id }, { senha: senhaEncripta })
                acesso = await login(email, senha)
                return acesso
            }
        } else if (acesso.message == "Senha Incorreta") {   
            let result = await UserModel.findOne({ email })
            if (result) {
                await UserModel.findByIdAndUpdate({ _id: result._id }, { senha: senhaEncripta })
                acesso = await login(email, senha)
                return acesso
            }
        }
        return acesso
    } else {
        let historicoSenha = await AntigaControl.SenhaAntiga(email, senha)
        if (historicoSenha.status == 400) {
            return historicoSenha
        }
        let result = await UserModel.findOne({ email })
        if (result) {
            await UserModel.findByIdAndUpdate({ _id: result._id }, { senha: senhaEncripta })
            acesso = await login(email, senha)
            return acesso
        }
        return Funcao.padraoErro("Ops, Algo deu errado!!")
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
    let user1 = await UserModel.findById(user)
    formata.id = user
    formata.nome = await Funcao.verificajwt(user1.nome)
    formata.email = await Funcao.verificajwt(user1.email)
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
    if (email != '' && logExp.status == 400) {
        return logExp
    }
    switch (rota) {
        case "inserir":
            await LogControl.deleta(email)
            result = await inserir(nome, email, senha, testeSenha.result.senhacripta)
            break;
        case "login":
            result = await login(email, senha)
            break;
        case "AlterarSenha":
            await LogControl.deleta(email)
            result = await AlterarSenha(email, senha, senhaAntiga)
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
    if(result==null||result==''|| result==undefined){
        return Funcao.padraoErro("Erro na Rota "+rota+" não foi retornado dados. Contate o desenvolvedor.")
    }
    return result
}
module.exports = { Validador, excluirUm, listar, listarUm, testeSenha }