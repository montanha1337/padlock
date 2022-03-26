import Funcao from './functions'
import UserModel from '../model/user'
import LogControl from './LogController'

//#region CRUD

async function inserir(nome, email, senha) {
    let result
    email = Funcao.validaEmail(email)
    if (email.retorno == true) {
        senha = await Funcao.validaSenha(senha)
        if (senha.valida == true) {
            nome = await Funcao.encripta(nome)
            await UserModel.create({ email: email.email, nome, senha: senha.senhacripta })
            result = await login(email.email, senha.senha)
            return result
        } else {
            return senha
        }
    } else {
        return email
    }
}

async function login(email, senha) {
    try {
        let oValidaEmail
        let oValidaSenha
        let oSenhaBd
        let oBuscarUser
        let token
        let oLog
        oValidaEmail = Funcao.validaEmail(email)
        if (oValidaEmail.status == false) {
            return oValidaEmail
        }
        oValidaSenha = await Funcao.validaSenha(senha)
        if (oValidaSenha.status == false) {
            return oValidaSenha
        }
        //oLog = await LogControl.ValidaLogin(email)
        //if(oLog.status==false){
        //    return oLog
        //}
        oBuscarUser = await UserModel.find({ email })
        if (oBuscarUser == "") {
            return Funcao.padraoErro("Usuário não cadastrado")
        }else{
            oSenhaBd = await Funcao.verificajwt(oBuscarUser[0].senha)
            if (oSenhaBd == false) {
                return Funcao.padraoErro("Senha Expirada")
            }
            if (oSenhaBd == senha) {
                token = await Funcao.gerajwt(oBuscarUser[0]._id)
                return token
             } else {
                //await LogControl.ValidaLogin(email)
                return Funcao.padraoErro("Senha Incorreta")
            }
        }
    } catch (e) {
        console.log(e)
        return Funcao.padraoErro("Ops,Algo de errado!!")
    }
}


async function AlterarSenha(email, senha) {
    let result = new Object()
    let token
    result = await login(email, senha)
    if (result.mensagem == "Senha Incorreta" || result.mensagem == "Senha Expirada") {
        let result = await UserModel.findOne({ email })
        if (result) {
            senha = await testeSenha(senha)
            if (senha.status == false)
                return Funcao.padraoErro(senha.mensagem)
            await UserModel.findByIdAndUpdate({ _id: result._id }, { senha: senha.senhacripta })
            token = await Funcao.gerajwt(result._id)
            return token
        } else {
            return Funcao.padraoErro("Email não encontrado!!")
        }
    } else {
        return result
    }
}

async function excluirId(user) {
    user = await Funcao.verificajwt(user)
    if (user == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    let result = await UserModel.findByIdAndDelete(user)
    return result
}

async function listarUm(user) {
    user = await Funcao.verificajwt(user)
    if (user == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    user = await UserModel.findById(user)
    return user
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