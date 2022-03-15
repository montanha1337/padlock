import Funcao from './functions'
import ContatoModel from '../model/contato'
import PixControl from './pixController'

async function formataDados(pix, tipo) {
    pix = await Funcao.verificajwt(pix)

    if (pix == false) {
        return Funcao.padraoErro("Chave pix incorreta")
    }
    let format = new Object()
    format.pix = pix
    format.tipo = tipo
    return format
}

async function inserir(IdUser, nome, pixNovo, tipo) {
    let inserir = new Object()
    let pix = new Object()
    let valida = PixControl.testePix(pixNovo, tipo)
    if (valida.validador == false) {
        return Funcao.padraoErro(valida.mensagem)
    }
    pixNovo = await Funcao.encripta(pixNovo)
    IdUser = await Funcao.verificajwt(IdUser)
    if (IdUser == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    pix.pix = pixNovo
    pix.tipo = tipo
    inserir.adicionar = await ContatoModel.insertMany({ IdUser, nome, pix })
    console.log(inserir)
    return inserir
}

async function adicionarPix(IdUser, nome, pixNovo, tipo) {
    let inserir = new Object()
    let pix = new Object()
    let valida = PixControl.testePix(pixNovo, tipo)
    inserir.result = true
    if (valida.validador == false) {
        return Funcao.padraoErro(valida.mensagem)
    }
    pixNovo = await Funcao.encripta(pixNovo)
    IdUser = await Funcao.verificajwt(IdUser)
    if (IdUser == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    pix.pix = pixNovo
    pix.tipo = tipo
    inserir.adicionar = await ContatoModel.updateOne({ IdUser, nome }, { $push: { pix: pix } })
    if (inserir.adicionar.matchedCount !== 1) {
        console.log(inserir.adicionar)
        inserir.result = Funcao.padraoErro("Não possivel completar a adição.")
    }
    return inserir.result
}

/*async function listar(IdUser){
    IdUser =await Funcao.verificajwt(IdUser)
    if(IdUser==false){
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    let listar = new Object()
    let lista = await ContatoModel.find({IdUser})
    listar.nome = lista[0].nome
    listar.pix=lista[0].pix
    for(let i = 0; i < listar.pix.length; i++){
        listar.pix[i].pix = await Funcao.verificajwt(listar.pix[i].pix)
        listar.pix[i]._id[i]
        console.log({i,teste:listar.pix[i]._id})
    }

    return listar
}*/
async function listar(IdUser) {
    let listar = new Object()
    listar = []
    IdUser = await Funcao.verificajwt(IdUser)
    if (IdUser == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    let lista = await ContatoModel.find({ IdUser }).select({})
    for (let i = 0; i < lista[0].pix.length; i++) {
        listar[i] = await formataDados(lista[0].pix[i].pix, lista[0].pix[i].tipo)
    }
    console.log(listar)
    return { nome: lista[0].nome, pix: listar }
}
module.exports = { inserir, adicionarPix, listar }