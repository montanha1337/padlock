import ConfigModel from '../model/config'
import ConfigPixModel from '../model/tipoPix'

//#region PALAVRA CHAVE
async function inserirPalavra(secreta) {
    const totalBanco = 0
    let secreto = await ConfigModel.create({ secreta, totalBanco })
    return secreto.secreta
}

async function palavra() {
    let secreta = await ConfigModel.findOne()
    return secreta.secreta
}
//#endregion

//#region BANCO
async function inserirTotalBanco(totalBanco) {
    let banco = await ConfigModel.findOne({})
    banco = await ConfigModel.findOneAndUpdate({ _id: banco._id }, { totalBanco })
    return banco.totalBanco
}

async function totalBanco() {
    let banco = await ConfigModel.findOne({})
    return banco.totalBanco
}
//#endregion

//#region TIPO PIX
async function inserirTipoPix(tipo) {
    let tipoPix = await ConfigPixModel.create({ tipoPix: tipo })
    return tipoPix
}
async function listarTipoPix() {
    let tipoPix = await ConfigPixModel.find().select({ tipopix: 0 })
    return tipoPix
}
//#endregion

module.exports = { inserirPalavra, palavra, inserirTotalBanco, totalBanco, inserirTipoPix, listarTipoPix }