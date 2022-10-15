import LogModel from '../model/logs'
import Funcao from './functions'

async function InserirLog(email) {
    let oBuscaLog
    let tentativa = 1
    let data = new Date()
    let oValidaAcesso = await ValidaAcesso(email)
    if (oValidaAcesso.status == 400) {
        return oValidaAcesso //trata o bloqueio
    }
    if (oValidaAcesso.result.message == "liberado") { //trata os que ainda napo estão bloqueados
        oBuscaLog = await LogModel.findOne({ email })
        if (oBuscaLog) {
            tentativa = oBuscaLog.tentativa + tentativa
            await LogModel.findByIdAndUpdate(oBuscaLog._id, { tentativa, data })
            return Funcao.padraoSucesso({ message: "Atualizado e liberado" })
        } else {
            return Funcao.padraoErro(oBuscaLog)
        }
    } else { //trata os que erraram a primeira vez
        await LogModel.create({ email, tentativa, data })
        return Funcao.padraoSucesso({ message: "Gravado e liberado" })
    }
}

async function ValidaAcesso(email) {
    let result = await LogModel.findOne({ email })
    if (result) {
        let data = new Date()
        let data1 = Date.parse(data)
        let data2 = result.data
        data = data1 - data2
        if (data >= 420000 && result.tentativa > 3) {
            return Funcao.padraoErro("Usuário bloqueado, tente novamente mais tarde")
        } else {
            return Funcao.padraoSucesso({ message: "liberado" })
        }
    } else {
        return Funcao.padraoSucesso({ message: "Email nao encontrado no Log." })
    }
}

async function deleta(email) {
    await LogModel.findOneAndDelete({ email })
    return Funcao.padraoSucesso({ message: "apagado com sucesso" })
}

module.exports = { InserirLog, deleta, ValidaAcesso }