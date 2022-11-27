import Framework from './functions'
import ContatoModel from '../model/contato'
import PixControl from './pixController'

async function formataDados(pix, tipo) {
    pix = await Framework.ManipularDado("desencripta", pix)
    if (pix.status != 200) {
        return pix
    }
    let format = new Object()
    format.pix = pix.result
    format.tipo = tipo
    return format
}

async function inserir(IdUser, nome, pixNovo, tipo) {
    let inserir = new Object()
    let pix = new Object()
    let valida = PixControl.validaPix(pixNovo, tipo)
    if (valida.Validador.status != 200)
        return valida.Validador

    pixNovo = await Framework.ManipularDado("encripta", pixNovo)
    IdUser = await Framework.ManipularToken("dev-retornaId", IdUser)

    if (IdUser.status != 200)
        return IdUser

    pix.pix = pixNovo.result
    pix.tipo = tipo
    var contatoExistente = await ContatoModel.find({ IdUser: IdUser.result, nome })
    if (contatoExistente.length == 0)
        inserir.adicionar = await ContatoModel.insertMany({ IdUser: IdUser.result, nome, pix })
    else
        await ContatoModel.updateOne({ IdUser: IdUser.result, nome }, { $push: { pix: pix } })
    return Framework.PadronizarRetorno("sucesso", 200, inserir)
}

async function adicionarPix(IdUser, nome, pixNovo, tipo) {
    let inserir = new Object()
    let pix = new Object()
    let valida = PixControl.validaPix(pixNovo, tipo)
    inserir.result = true
    
    if (valida.Validador.status != 200)
        return valida.Validador
    
    pixNovo = await Framework.ManipularDado("encripta", pixNovo)
    IdUser = await Framework.ManipularToken("dev-retornaId", IdUser)
    if (IdUser.status != 200) {
        return Framework.PadronizarRetorno("erro", 400, "Usuario não identificado!!!")
    }
    pix.pix = pixNovo.result
    pix.tipo = tipo
    inserir.adicionar = await ContatoModel.updateOne({ IdUser, nome }, { $push: { pix: pix } })
    if (inserir.adicionar.matchedCount !== 1) {
        return Framework.PadronizarRetorno("erro", 400, "Não possivel completar a adição.")
    }
    IdUser = await Framework.ManipularToken("gera", IdUser)
    return Framework.PadronizarRetorno("sucesso", 200, { token: IdUser })
}

async function listar(IdUser, contato) {
    let listar = new Object()
    listar = []
    IdUser = await Framework.ManipularToken("dev-retornaId", IdUser)
    if (IdUser.status != 200) {
        return Framework.PadronizarRetorno("erro", 400, "Usuario não identificado!!!")
    }
    let lista = await ContatoModel.find({ IdUser: IdUser.result, nome: contato })
    if (lista == "")
        return Framework.PadronizarRetorno("erro", 400, "Não foi encontrado o contato deste usuario.")

    for (let i = 0; i < lista[0].pix.length; i++) {
        listar[i] = await formataDados(lista[0].pix[i].pix, lista[0].pix[i].tipo)
    }
    IdUser = await Framework.ManipularToken("criar", IdUser.result)
    return Framework.PadronizarRetorno("sucesso", 200, { token: IdUser.result, Contato: lista[0].nome, pix: listar })
}

async function listarContato(IdUser) {
    let listar = new Object()
    listar = []
    IdUser = await Framework.ManipularToken("dev-retornaId", IdUser)
    if (IdUser.status != 200) {
        return Framework.PadronizarRetorno("erro", 400, "Usuario não identificado!!!")
    }
    let lista = await ContatoModel.find({ IdUser: IdUser.result })
    if (lista == "") {
        return Framework.PadronizarRetorno("sucesso", 200, "Não foi encontrados contatos para este usuario.")
    }
    for (let i = 0; i < lista.length; i++) {
        listar[i] = { Nome: lista[i].nome }
    }
    IdUser = await Framework.ManipularToken("criar", IdUser.result)
    return Framework.PadronizarRetorno("sucesso", 200, { token: IdUser.result, Contato: listar })
}

async function EditarContato(user, contato, nome) {
    user = await Framework.verificajwt(user)
    if (user == false) {
        return Framework.PadronizarRetorno("erro", 400, "Usuario não Encontrado")
    }
    contato = await Framework.verificajwt(contato)
    if (contato == false) {
        return Framework.PadronizarRetorno("erro", 400, "Contato não Encontrado")
    }
    await ContatoModel.findOneAndUpdate({ IdUser: user, _id: contato }, { nome })
    return Framework.PadronizarRetorno("sucesso", 200, "")
}

async function listarUm(user, contato) {
    let listar
    user = await Framework.verificajwt(user)
    if (user == false) {
        return Framework.PadronizarRetorno("erro", 400, "Usuario não identificado!!!")
    }
    contato = await Framework.verificajwt(contato)
    if (contato == false) {
        return Framework.PadronizarRetorno("erro", 400, "Contato não identificado!!!")
    }
    listar = await ContatoModel.findById({ IdUser: user, _id: contato }, nome)
    return Framework.PadronizarRetorno("sucesso", 200, listar)
}

async function excluirContato(idUser, Contato) {
    idUser = Framework.ManipularToken("dev-retornaId", idUser)

    if (idUser == false)
        return Framework.PadronizarRetorno("erro", 400, "Usuario não Encontrado")

    await ContatoModel.deleteMany({ IdUser: idUser, nome: Contato })
    let busca = await ContatoModel.find({ IdUser: idUser, nome: Contato })

    if (busca == "")
        return Framework.PadronizarRetorno("sucesso", 200, { message: "Deletado com sucesso" })
    else
        return Framework.PadronizarRetorno("erro", 400, { message: "Erro ao deletar" })
}

async function excluirPix(user, nome, pix) {
    user = await Framework.ManipularToken("dev-retornaId", user)
    if (user.status != 200)
        return user
    pix = await Framework.ManipularDado("encripta", pix)
    if (user.status != 200)
        return user

    pix = pix.result
    var contatoExistente = await ContatoModel.find({ IdUser: user.result, nome })
    if (contatoExistente[0].pix.length == 1) {
        await ContatoModel.deleteMany({ IdUser: user.result, nome })
    }
    else {
        contatoExistente = await ContatoModel.find({ IdUser: user.result, nome, pix: { $elemMatch: { pix: pix } } })
        await ContatoModel.findByIdAndDelete(contatoExistente[0].id)

        for (let i = 0; i < contatoExistente[0].pix.length; i++) {
            if (contatoExistente[0].pix[i].pix == pix)
                contatoExistente[0].pix.splice(i, 1);
        }
        await ContatoModel.insertMany(contatoExistente[0])
    }

    contatoExistente = await ContatoModel.find({ IdUser: user.result, nome, pix: { $elemMatch: { pix: pix } } })
    if (contatoExistente.length == 0)
        return Framework.PadronizarRetorno("sucesso", 200, "Excluído com sucesso")
    else
        return Framework.PadronizarRetorno("erro", 400, "Falha ao excluir")
}

module.exports = { inserir, adicionarPix, EditarContato, listar, listarContato, listarUm, excluirContato, excluirPix }