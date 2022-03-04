import Funcao from './functions'
import PixModel from '../model/Pix';
import UserControl from './userController';
import BancoControl from './BancoController'

function organizaDados(nome,email,pix,tipo,nomeBanco,codeBanco,fullNome){
    let organiza = new Object()
    let usuario= new Object()
    let banco = new Object()
    pix = Funcao.verificajwt(pix)
    usuario.nome = nome
    usuario.email = email
    banco.nome=nomeBanco
    banco.codigo = codeBanco
    banco.nomeCompleto = fullNome
    organiza.usuario = usuario
    organiza.banco = banco
    organiza.pix = pix
    organiza.tipoPix = tipo
    return organiza
}

async function inserir(user,emailUser,pix,banco,tipo){
    let result
    let usuario = new Object()
    let buscaUser
    let buscaBanco
    pix= Funcao.encripta(pix)
    user = Funcao.verificajwt(user)
    if(user==false){
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    result = await PixModel.create({user,emailUser,tipo,pix,banco})
    buscaUser = await UserControl.listarUm(user)
    buscaBanco = await BancoControl.listarUm(banco)
    usuario = organizaDados(buscaUser.nome,buscaUser.email,result.pix,result.tipo,buscaBanco.nome,buscaBanco.code,buscaBanco.fullNome)
    return usuario
}
async function listar(user,emailUser){
    let pix = new Object()
    let buscaPix
    let buscaUser
    let buscaBanco
    user = Funcao.verificajwt(user)
    if(user==false){
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    buscaPix = await PixModel.find({user,emailUser})
    pix.dados = buscaPix
    pix.tamanho = buscaPix.length
    pix.lista=buscaPix
    if(buscaPix[0]){
        for(let i = 0; i < pix.tamanho; i++){
            buscaUser = await UserControl.listarUm(user)
            buscaBanco = await BancoControl.listarUm(pix.dados[i].banco)
            pix.lista[i]=organizaDados(buscaUser.nome,buscaUser.email,pix.dados[i].pix,pix.dados[i].tipo,buscaBanco.nome,buscaBanco.code,buscaBanco.fullNome)
        }
        return pix.lista
    }else{
        return Funcao.padraoErro("Ocorreu um erro, por favor verifique os dados.")
    }

}
async function excluirId(user,email,pix){
    let pixBanco
    let buscaPix
    let tamanho
    user = Funcao.verificajwt(user)
    if(user==false){
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    buscaPix = await PixModel.find({user,email})
    tamanho =buscaPix.length
    for(let i = 0; i < tamanho; i++){
        pixBanco =  Funcao.verificajwt(buscaPix[i].pix)
        if(pix==pixBanco){
            await PixModel.findByIdAndDelete(buscaPix[i]._id)
        }
    }
    buscaPix = await PixModel.find({user,email})
    tamanho =buscaPix.length
    return tamanho
}


module.exports = {inserir,listar,excluirId}