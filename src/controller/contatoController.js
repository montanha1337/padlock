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
    return Funcao.padraoSucesso(format)
}

async function inserir(IdUser, nome, pixNovo, tipo) {
    let inserir = new Object()
    let pix = new Object()
    let valida = PixControl.testePix(pixNovo, tipo)
    if (valida.status == 400) {
        return valida
    }
    pixNovo = await Funcao.encripta(pixNovo)
    IdUser = await Funcao.verificajwt(IdUser)
    if (IdUser == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    pix.pix = pixNovo
    pix.tipo = tipo
    inserir.adicionar = await ContatoModel.insertMany({ IdUser, nome, pix })
    return Funcao.padraoSucesso(inserir)
}

async function adicionarPix(IdUser, nome, pixNovo, tipo) {
    let inserir = new Object()
    let pix = new Object()
    let valida = PixControl.testePix(pixNovo, tipo)
    inserir.result = true
    if (valida.status == 400) {
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
        return Funcao.padraoErro("Não possivel completar a adição.")
    }
}
async function listar(IdUser) {
    let listar = new Object()
    let id
    listar = []
    IdUser = await Funcao.verificajwt(IdUser)
    if (IdUser == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    I
    let lista = await ContatoModel.find({ IdUser })
    id= await Funcao.gerajwt(lista[0].id)
    for (let i = 0; i < lista[0].pix.length; i++) {
        listar[i] = await formataDados( lista[0].pix[i].pix, lista[0].pix[i].tipo)
    }
    IdUser = await Funcao.gerajwt(IdUser)
    return Funcao.padraoSucesso({token:IdUser,tokenContato : id, Contato: lista[0].nome, pix: listar })
}

async function listarUm(user,contato) {
    let listar
    user = await Funcao.verificajwt(user)
    if (user == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    contato = await Funcao.verificajwt(contato)
    if (contato == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    listar = await ContatoModel.findById({IdUser:user,_idcontato})
    return Funcao.padraoSucesso(listar)
}

async function excluirContato(user) {
    user = await Funcao.verificajwt(user)
    if (user == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    let result = await UserModel.findByIdAndDelete(user)
    return Funcao.padraoSucesso(result)
}
async function excluirPix(user) {
    user = await Funcao.verificajwt(user)
    if (user == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    let result = await ContatoModel.findByIdAndDelete(user)
    return Funcao.padraoSuucesso(result)
}


module.exports = { inserir, adicionarPix, listar, listarUm, excluirContato, excluirPix }