import Funcao from './functions'
import AntigaModel from '../model/senhaAntiga'

async function inserir(email, senha) {
    senha = await Funcao.encripta(senha)
    await AntigaModel.insertMany({ email, senha: { senha: senha } })
    return Funcao.padraoSucesso("Senha nunca utilizada.")
}

async function validaAntiga(email, senha) {
    let result = await AntigaModel.find({ email })
    let iguais = 0
    if (result[0] != null) {
        for (let i = 0; i < result[0].senha.length; i++) {
            let contsenha = await Funcao.verificajwt(result[0].senha[i].senha)
            if (contsenha == false) {
                return Funcao.padraoErro("Senha encriptada Inválida.")
            }
            if (contsenha == senha) {
                iguais++
            }
        }
        if(iguais==0){
            senha = await Funcao.encripta(senha)
            let add = await AntigaModel.updateOne({ email }, { $push: { senha:{senha} } })
            if (add.matchedCount !== 1) {
                return Funcao.padraoErro("Não possivel adicionar a senha.")
            }
             return Funcao.padraoSucesso("Senha nunca utilizada")
        }else{
            return Funcao.padraoErro("Senha já utilizada.")
        }
    } else {
        return await inserir(email, senha)
    }
}

async function SenhaAntiga(email, senha) {

    //#region Valida Senha

    let senhaDescript = await Funcao.verificajwt(senha)
    if (senhaDescript == false) {
        senha = await Funcao.validaSenha(senha)
    }
    else {
        senha = await Funcao.validaSenha(senhaDescript)
    }
    if (senha.status == 400) {
        return senha
    }
    senha = senha.result.senha
    //#endregion

    //#region Valida Email

    let result = await AntigaModel.find({ email })
    if (result[0] != null) {       
        return await validaAntiga(email, senha)
    } else {
        return await inserir(email, senha)
    }
}

 async function DeletaAntiga(email){
    let result = await AntigaModel.find({ email })
    if (result[0] != null) {  
     await AntigaModel.findOneAndDelete({email})
    }
 }

module.exports = { SenhaAntiga, DeletaAntiga }