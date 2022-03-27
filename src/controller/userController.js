import Funcao from './functions'
import UserModel from '../model/user'
import LogControl from './LogController'

//#region CRUD

async function inserir(nome, email, senha) {
    let result
    result = await login(email, senha)
    if (result.message == "Usuário não cadastrado") {
        nome = await Funcao.encripta(nome)
        result = await Funcao.validaSenha(senha)
        console.log(result.result.senhacripta)
        if (result.status == 200) {
            await UserModel.create({ email, nome, senha: result.result.senhacripta })
            result = await login(email, senha)
            return result
        } else {
            return result
        }
    } else if(result.message == "Senha Expirada"){
        
    }else{
        return result
    }
}

async function login(email, senha) {
    let oValidaEmail
    let oValidaSenha
    let oSenhaBd
    let oBuscarUser
    let token
    let oLog
    oValidaEmail = Funcao.validaEmail(email)
    if (oValidaEmail.status == 400) {
        return oValidaEmail
    }
    oValidaSenha = await Funcao.validaSenha(senha)
    if (oValidaSenha.status == 400) {
        return oValidaSenha
    }
    oLog = await LogControl.InserirLog(email)
    if(oLog.status==400){
        return oLog
    }
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

async function AlterarSenha(email, senha) {
    await LogControl.deleta(email)
    let valida = await login(email, senha)
    if (valida.status == 200) {
        return valida
    } else if (valida.message == "Senha Incorreta" || valida.message == "Senha Expirada") {
        valida = await Funcao.validaSenha(senha)
        console.log("2"+valida)
        if (valida.status == 400) {
            return valida
        } else {
            let result = await UserModel.findOne({ email })
            console.log(valida)
            if (result) {
                await UserModel.findByIdAndUpdate({ _id: result._id }, { senha: valida.result.senhacripta })
                let ologin = await login(email, senha)
                return ologin
            }
        }
    }
}

async function excluirId(user) {
    user = await Funcao.verificajwt(user)
    if (user == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    let result = await UserModel.findByIdAndDelete(user)
    return padraoSucesso(result)
}

async function listarUm(user) {
    user = await Funcao.verificajwt(user)
    if (user == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    user = await UserModel.findById(user)
    
    return Funcao.padraoSucesso(user)
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


module.exports = { inserir, excluirUm, excluirId, listar, login, AlterarSenha, listarUm, testeSenha }