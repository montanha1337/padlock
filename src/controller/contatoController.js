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
        return Funcao.padraoErro("Não possivel completar a adição.")
    }
    IdUser = await Funcao.gerajwt(IdUser)
    return Funcao.padraoSucesso({token: IdUser})
}

async function listar(IdUser,contato) {
    let listar = new Object()
    let id
    listar = []
    IdUser = await Funcao.verificajwt(IdUser)
    if (IdUser == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    let lista = await ContatoModel.find({ IdUser, nome: contato })
    if(lista == ""){
        return Funcao.padraoErro("Não foi encontrados contatos para este usuario.")
    }
    id= await Funcao.gerajwt(lista[0].id)
    for (let i = 0; i < lista[0].pix.length; i++) {
        listar[i] = await formataDados( lista[0].pix[i].pix, lista[0].pix[i].tipo)
    }
    IdUser = await Funcao.gerajwt(IdUser)
    return Funcao.padraoSucesso({token:IdUser, Contato: lista[0].nome, pix: listar })
}

async function listarContato(IdUser) {
    let listar = new Object()
    listar = []
    IdUser = await Funcao.verificajwt(IdUser)
    if (IdUser == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    let lista = await ContatoModel.find({ IdUser })
    if(lista == ""){
        return Funcao.padraoErro("Não foi encontrados contatos para este usuario.")
    }
    for (let i = 0; i < lista.length; i++) {        
        listar[i] = {Nome: lista[i].nome}
    }
    IdUser = await Funcao.gerajwt(IdUser)
    return Funcao.padraoSucesso({token:IdUser, Contato: listar})
}

async function EditarContato(user,contato,nome){
    user = await Funcao.verificajwt(user)
    if(user==false){
        return Funcao.padraoErro("Usuario não Encontrado")
    }
    contato = await Funcao.verificajwt(contato)
    if(contato==false){
        return Funcao.padraoErro("Contato não Encontrado")
    }
    await ContatoModel.findOneAndUpdate({IdUser:user,_id:contato},{nome})
    return Funcao.padraoSucesso()
}

async function listarUm(user,contato) {
    let listar
    user = await Funcao.verificajwt(user)
    if (user == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    contato = await Funcao.verificajwt(contato)
    if (contato == false) {
        return Funcao.padraoErro("Contato não identificado!!!")
    }
    listar = await ContatoModel.findById({IdUser:user,_id:contato},nome)
    return Funcao.padraoSucesso(listar)
}

async function excluirContato(idUser,Contato) {
    idUser = await Funcao.verificajwt(idUser)

    if(idUser==false)
        return Funcao.padraoErro("Usuario não Encontrado")

    await ContatoModel.deleteMany({IdUser:idUser,nome:Contato})
    let busca = await ContatoModel.find({IdUser:idUser,nome:Contato})

    if(busca=="")
        return Funcao.padraoSucesso({message:"Deletado com sucesso"})
    else 
        return Funcao.padraoErro({message:"Erro ao deletar"})
}

async function excluirPix(user,pix) {
    user = await Funcao.verificajwt(user)
    if (user == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    let result = await ContatoModel.findOneAndDelete({IdUser:user,pix:{pix}})
    return Funcao.padraoSucesso(result)
}

module.exports = { inserir, adicionarPix, EditarContato, listar, listarContato, listarUm, excluirContato, excluirPix }