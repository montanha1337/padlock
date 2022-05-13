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
        }else {
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

async function AlterarSenha(email, senha) {
    await LogControl.deleta(email)
    let valida = await login(email, senha)
    if (valida.status == 200) {
        return valida
    } else if (valida.message == "Senha Incorreta" || valida.message == "Senha Expirada") {
        valida = await Funcao.validaSenha(senha)
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
    let email = await UserModel.findById(user)
    let result = await UserModel.findByIdAndDelete(user)
    await AntigaControl.DeletaAntiga(email.email)
    return Funcao.padraoSucesso(result)
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


async function Validador(token, nome, email,senha, rota){
    let user = await Funcao.verificajwt(token)
    let testeEmail = Funcao.validaEmail(email)
    let testeSenha = Funcao.validaSenha(senha)
    let novotoken = await Funcao.atualizajwt(token)
    let historicoSenha = await AntigaControl.SenhaAntiga(email, senha)
    let testelog = await LogControl.ValidaAcesso(email)
    let result
    console.log({token,nome,email,senha,rota,user,testeEmail,testeSenha,testelog,novotoken,historicoSenha})
    if(token!=''){s
        console.log("aqui")
        novotoken=""
    }
    if(user==false||token != ''){
        return Funcao.padraoErro("usuario não encontrado!!")
    }
    if(email!='' && testeEmail.status==400){
        return testeEmail
    }
    if(senha=='' && testeSenha.status==400){
        return testeSenha
    }
    if(historicoSenha.status==400 && rota !="login"&& email!='' && senha!=''){
        return historicoSenha
    }
    if(email!='' && testelog.status == 400){
        return testelog
    }
    console.log(testeSenha.result.senhacripta)
    // switch (rota) {
    //     case "inserir":
    //         await LogControl.deleta(email)
    //         result = await inserir(nome,email,senha)
    //         break;
    //     case "login":
    //         result = await login(email,senha)
    //         break;
    //     case "AlterarSenha":
    //         result = await LogControl.deleta(email)
    //         await AlterarSenha(email,senha)
    //         break;
    //     case "deleteId":
    //         await LogControl.deleta(email)
    //         result = await excluirId(user)
    //         break;    
    //     default:
    //         return padraoErro("Rota não encontrada!!!")
    // }
    // if(result.status=400){
    //     return result
    // }else{
        return Funcao.padraoSucesso("result:result.result")
    //}
}


module.exports = { Validador, excluirUm, listar, listarUm, testeSenha }