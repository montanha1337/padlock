import Funcao from './functions'
import PixModel from '../model/Pix'
import UserControl from './userController'
import BancoControl from './BancoController'
import validator from "validar-telefone"
import ConfigControl from "./config"

function validaPix(pix, tipo) {
    let valida = new Object()
    let aleatorio
    valida.pix = pix
    valida.mensagem = "Pix Inválido."
    switch (tipo) {
        case "cpf":
            valida.validador = Funcao.validaCpf(pix)
            return valida
        case "cnpj":
            valida.validador = Funcao.validaCnpj(pix)
            return valida
        case "email":
            valida.validador = Funcao.validaEmail(pix)
            return valida
        case "telefone":
            valida.validador = validator(pix)
            return valida
        case "aleatoria":
            aleatorio = pix.split("")
            aleatorio = aleatorio.length
            if (aleatorio !== 32) {
                valida.validador = false
                return valida
            }
            valida.validador = true
            return valida
        default:
            valida.validador = false
            valida.mensagem = "Tipo Inválido"
            return valida
    }
}

async function organizaDados(nome, email, pix, tipo, nomeBanco, codeBanco, fullNome) {
    let organiza = new Object()
    let usuario = new Object()
    let banco = new Object()
    pix = await Funcao.verificajwt(pix)
    usuario.nome = nome
    usuario.email = email
    banco.nome = nomeBanco
    banco.codigo = codeBanco
    banco.nomeCompleto = fullNome
    organiza.usuario = usuario
    organiza.banco = banco
    organiza.pix = pix
    organiza.tipoPix = tipo
    return organiza
}

async function inserir(user, emailUser, pix, banco, tipo) {
    let result
    let usuario = new Object()
    let buscaUser
    let buscaBanco
    let valida = validaPix(pix, tipo)
    if (valida.validador == false) {
        return Funcao.padraoErro(valida.mensagem)
    }
    pix = await Funcao.encripta(pix)
    user = await Funcao.verificajwt(user)
    if (user == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    valida = await PixModel.find({ user, emailUser, banco })
    if (valida.length > 5) {
        return Funcao.padraoErro("Quantidade de pix cadastrados excede o limite para este banco.")
    }
    result = await PixModel.create({ user, emailUser, tipo, pix, banco })
    buscaUser = await UserControl.listarUm(user)
    buscaBanco = await BancoControl.listarUm(banco)
    usuario = await organizaDados(buscaUser.nome, buscaUser.email, result.pix, result.tipo, buscaBanco.nome, buscaBanco.code, buscaBanco.fullNome)
    return Funcao.padraoSucesso(usuario)
}

async function listar(user, emailUser) {
    let pix = new Object()
    let buscaPix
    let buscaUser
    let buscaBanco
    let userdescript = await Funcao.verificajwt(user)
    if (userdescript == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    buscaPix = await PixModel.find({ userdescript, emailUser })
    pix.dados = buscaPix
    pix.tamanho = buscaPix.length
    pix.lista = buscaPix
    if (buscaPix[0]) {
        for (let i = 0; i < pix.tamanho; i++) {
            console.log(userdescript)
            buscaUser = await UserControl.listarUm(userdescript)
            if (buscaUser.status == 400) {
                return buscaUser
            }
            buscaBanco = await BancoControl.listarUm(pix.dados[i].banco)
            if (buscaBanco.status == 400) {
                return buscaBanco
            }
            pix.lista[i] = await organizaDados(buscaUser.nome, buscaUser.email, pix.dados[i].pix, pix.dados[i].tipo, buscaBanco.nome, buscaBanco.code, buscaBanco.fullNome)
        }
        return Funcao.padraoSucesso(pix.lista)
    } else {
        return Funcao.padraoErro("Não foi encontrado registros para este usuário.")
    }
}

async function listarUm(user, emailUser, pixBusca) {
    let pix = new Object()
    let buscaPix
    let buscaUser
    let buscaBanco
    user = await Funcao.verificajwt(user)
    if (user == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    buscaPix = await PixModel.find({ user, emailUser })
    pix.tamanho = buscaPix.length
    if (buscaPix[0]) {
        for (let i = 0; i < pix.tamanho; i++) {
            pix.encript = buscaPix[i].pix
            buscaPix[i].pix = await Funcao.verificajwt(buscaPix[i].pix)
            if (buscaPix[i].pix == pixBusca) {
                buscaUser = await UserControl.listarUm(user)
                buscaBanco = await BancoControl.listarUm(buscaPix[i].banco)
                pix.dados = await organizaDados(buscaUser.nome, buscaUser.email, pix.encript, buscaPix[i].tipo, buscaBanco.nome, buscaBanco.code, buscaBanco.fullNome)
            } else {
                pix.dados = Funcao.padraoErro("pix não encontrado.")
            }
        }
        return Funcao.padraoSucesso(pix.dados)
    } else {
        return Funcao.padraoErro("Email inválido.")
    }
}

async function excluirId(user, email, pix) {
    let pixBanco
    let buscaPix
    let tamanho
    user = await Funcao.verificajwt(user)
    if (user == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    buscaPix = await PixModel.find({ user, email })
    tamanho = buscaPix.length
    for (let i = 0; i < tamanho; i++) {
        pixBanco = await Funcao.verificajwt(buscaPix[i].pix)
        if (pix == pixBanco) {
            await PixModel.findByIdAndDelete(buscaPix[i]._id)
        }
    }
    buscaPix = await PixModel.find({ user, email })
    tamanho = buscaPix.length
    return Funcao.padraoSucesso(tamanho)
}

async function editar(user, email, pixAntigo, pixNovo, tipo, banco) {
    let valida = validaPix(pixNovo, tipo)
    if (valida.validador == false) {
        return Funcao.padraoErro(valida.mensagem)
    }
    let pix = new Object()
    let buscaPix
    let userEncript = user
    user = await Funcao.verificajwt(user)
    if (user == false) {
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    buscaPix = await PixModel.find({ user, email })
    pix.tamanho = buscaPix.length
    pix.novo = await Funcao.encripta(pixNovo)

    if (buscaPix[0]) {
        for (let i = 0; i < pix.tamanho; i++) {
            pix.encript = buscaPix[i].pix
            buscaPix[i].pix = await Funcao.verificajwt(buscaPix[i].pix)
            if (buscaPix[i].pix == pixAntigo) {
                await PixModel.findOneAndUpdate({ user, email, pix: pix.encript }, { pix: pix.novo, tipo, banco })
                pix.dados = await listarUm(userEncript, email, pixNovo)
                return Funcao.padraoSucesso(pix.dados)
            } else {
                pix.dados = Funcao.padraoErro("pix não encontrado.")
            }
        }
        return Funcao.padraoSucesso(pix.dados)
    } else {
        return Funcao.padraoErro("Email inválido.")
    }
}

function testePix(pix, tipo) {
    pix = validaPix(pix, tipo)
    if (pix.validador == true) {
        return Funcao.padraoSucesso("pix Válido")
    }
    return Funcao.padraoErro("Pix Inválido")
}

async function listarTipoPix() {
    let result = await ConfigControl.listarTipoPix()
    console.log(result.length)
    if (result.length> 1)
        return Funcao.padraoSucesso(result)
    else
        return Funcao.padraoErro("Não foi possivel retornar os dados.")
}

module.exports = { inserir, listar, listarUm, excluirId, editar, testePix, listarTipoPix }