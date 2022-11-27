import Framework from './functions'
import PixModel from '../model/Pix'
import UserControl from './userController'
import BancoControl from './BancoController'
import validator from "validar-telefone"
import ConfigControl from "./config"

//#region VIEW
async function Validador(token, container, rota) {
    let validartoken = "sucesso"

    //#region TRATAMENTO DE DADOS
    let idUser = await Framework.ManipularToken("dev-retornaId", token)
    if (idUser.status != 200)
        return Framework.PadronizarRetorno("erro", idUser.status, idUser.message)

    token = await Framework.ManipularToken("atualizar", token)
    if (token.status != 200)
        validartoken = "erro"
    //#endregion

    //#region CHAMADA DE METODOS
    switch (rota) {
        case "inserir":
            await LogControl.deleta(email)
            return await inserir(idUser.result, container.email, container.pix, container.Banco, container.tipo)

        case "listarTodos":
            return await listar(idUser.result, container.email)

        case "alterar":
            return await editar(idUser.result, container.email, container.pixAntigo, container.pixNovo, container.tipo, container.banco)

        case "deleteId":
            return await excluirId(idUser.result, container.email, container.pix)

        case "listarUm":
            return await listarUm(idUser.result, container.email, container.pix)

        case "listarTipoPix":
            return listarTipoPix()

        case "validarPix":
            return validaPix(container.pix, container.tipo)

        default:
            return Framework.PadronizarRetorno("erro", 400, "[Api] Erro ao informar a rota.")
    }
    //#endregion
}
//#endregion

//#region METODOS
async function inserir(user, emailUser, pix, banco, tipo) {
    let result
    let inserir = new Object()
    let buscaUser
    let buscaBanco
    let valida = await validaPix(pix, tipo)
    if (valida.validador.status != 200)
        return valida.validador

    pix = await Framework.ManipularDado("encripta", pix)
    user = await Framework.ManipularToken("dev-retornaId", user)

    if (user.status != 200)
        return Framework.PadronizarRetorno("erro", 400, "Usuario não identificado!!!")

    valida = await PixModel.find({ user: user.result, emailUser, banco })

    if (valida.length > 5)
        return Framework.PadronizarRetorno("erro", 400, "Quantidade de pix cadastrados excede o limite para este banco.")

    result = await PixModel.create({ user: user.result, emailUser, tipo, pix: pix.result, banco })
    buscaUser = await Framework.ManipularToken("criar", user.result)
    buscaBanco = await BancoControl.listarUm(banco)
    pix = await Framework.ManipularDado("desencripta", pix.result)
    inserir = await organizaDados(pix.result, tipo, buscaBanco.result.fullNome)
    inserir.token = buscaUser.result == null ? buscaUser.message : buscaUser.result
    return Framework.PadronizarRetorno("sucesso", 200, inserir)
}

async function listar(user, emailUser) {
    let pix = new Object()
    let listar = new Object()
    let buscaPix
    let buscaUser
    let buscaBanco
    let pixdescript
    let userdescript = user

    buscaPix = await PixModel.find({ userdescript, emailUser })
    pix.dados = buscaPix
    pix.tamanho = buscaPix.length
    pix.lista = buscaPix
    if (buscaPix[0]) {
        buscaUser = await Framework.ManipularToken("criar", user)
        if (buscaUser.status != 200)
            return Framework.PadronizarRetorno("erro", 400, "Não foi possivel gerar autenticação.")

        for (let i = 0; i < pix.tamanho; i++) {
            buscaBanco = await BancoControl.listarUm(pix.dados[i].banco)
            if (buscaBanco.status == 400) {
                return buscaBanco
            }
            pixdescript = await Framework.ManipularDado("desencripta", pix.dados[i].pix)
            pix.lista[i] = await organizaDados(pixdescript.result, pix.dados[i].tipo, buscaBanco.result.fullNome)
            buscaBanco = ""
        }
        listar.token = buscaUser.result
        listar.pix = pix.lista

        return Framework.PadronizarRetorno("sucesso", 200, listar)
    } else {
        return Framework.PadronizarRetorno("sucesso", 200, "Não foi encontrado registros para este usuário.")
    }
}

async function listarUm(user, emailUser, pixBusca) {
    let pix = new Object()
    let buscaPix
    let buscaUser
    let buscaBanco
    user = await Framework.verificajwt(user)
    if (user == false) {
        return Framework.PadronizarRetorno("erro", 400, "Usuario não identificado!!!")
    }
    buscaPix = await PixModel.find({ user, emailUser })
    pix.tamanho = buscaPix.length
    if (buscaPix[0]) {
        for (let i = 0; i < pix.tamanho; i++) {
            pix.encript = buscaPix[i].pix
            buscaPix[i].pix = await Framework.verificajwt(buscaPix[i].pix)
            if (buscaPix[i].pix == pixBusca) {
                buscaUser = await UserControl.listarUm(user)
                buscaBanco = await BancoControl.listarUm(buscaPix[i].banco)
                pix.dados = await organizaDados(buscaUser.nome, buscaUser.email, pix.encript, buscaPix[i].tipo, buscaBanco.nome, buscaBanco.code, buscaBanco.fullNome)
            } else {
                pix.dados = Framework.PadronizarRetorno("erro", 400, "pix não encontrado.")
            }
        }
        return Framework.PadronizarRetorno("sucesso", 200, pix.dados)
    } else {
        return Framework.PadronizarRetorno("erro", 400, "Email inválido.")
    }
}

async function excluirId(user, email, pix) {
    let pixBanco
    let buscaPix
    let tamanho
    user = await Framework.ManipularToken("dev-retornaId", user)
    if (user.status != 200) {
        return user
    }
    buscaPix = await PixModel.find({ user: user.result, emailUser: email })
    tamanho = buscaPix.length
    for (let i = 0; i < tamanho; i++) {
        pixBanco = await Framework.ManipularDado("desencripta", buscaPix[i].pix)
        if (pix == pixBanco.result) {
            await PixModel.findByIdAndDelete(buscaPix[i]._id)
        }
    }
    buscaPix = await PixModel.find({ user: user.result, email })
    if (buscaPix.length == 0)
        return Framework.PadronizarRetorno("sucesso", 200, "Excluido com sucesso")
    else
        return Framework.PadronizarRetorno("erro", 400, "Erro ao excluir")
}

async function editar(user, email, pixAntigo, pixNovo, tipo, banco) {
    let valida = validaPix(pixNovo, tipo)
    if (valida.validador.status != 200)
        return valida.validador
    
    let pix = new Object()
    let buscaPix
    let userEncript = user
    user = await Framework.verificajwt(user)
    if (user == false) {
        return Framework.PadronizarRetorno("erro", 400, "Usuario não identificado!!!")
    }
    buscaPix = await PixModel.find({ user, email })
    pix.tamanho = buscaPix.length
    pix.novo = await Framework.encripta(pixNovo)
    if (buscaPix[0]) {
        for (let i = 0; i < pix.tamanho; i++) {
            pix.encript = buscaPix[i].pix
            buscaPix[i].pix = await Framework.verificajwt(buscaPix[i].pix)
            if (buscaPix[i].pix == pixAntigo) {
                await PixModel.findOneAndUpdate({ user, email, pix: pix.encript }, { pix: pix.novo, tipo, banco })
                pix.dados = await listarUm(userEncript, email, pixNovo)
                return Framework.PadronizarRetorno("sucesso", 200, pix.dados)
            } else {
                pix.dados = Framework.PadronizarRetorno("erro", 400, "pix não encontrado.")
            }
        }
        return Framework.PadronizarRetorno("sucesso", 200, pix.dados)
    } else {
        return Framework.PadronizarRetorno("erro", 400, "Não existe pix para este usuario.")
    }
}

async function listarTipoPix() {
    let result = await ConfigControl.listarTipoPix()
    if (result.length > 1)
        return Framework.PadronizarRetorno("sucesso", 200, result)
    else
        return Framework.PadronizarRetorno("erro", 400, "Não foi possivel retornar os dados.")
}
//#endregion

//#region AUXILIARES
async function validaPix(pix, tipo) {
    let valida = new Object()
    let aleatorio
    valida.pix = pix
    switch (tipo) {
        case "cpf":
            valida.validador = await Framework.ValidarDado(tipo, pix)
            return valida
        case "cnpj":
            valida.validador = await Framework.ValidarDado(tipo, pix)
            return valida
        case "email":
            valida.validador = await Framework.ValidarDado(tipo, pix)
            return valida
        case "telefone":
            valida.validador = validator(pix)
            if(valida.validador)
                valida.validador = Framework.PadronizarRetorno("sucesso", 200, "Telefone válido.")
            else
                valida.validador = Framework.PadronizarRetorno("erro", 400, "Telefone Inválido")            
            return valida
        case "aleatoria":
            aleatorio = pix.split("")
            aleatorio = aleatorio.length
            if (aleatorio !== 32) {
                valida.validador = Framework.PadronizarRetorno("erro", 400, "chave aleatoria não contém 32 caracteres.")
                return valida
            }
            valida.validador = Framework.PadronizarRetorno("sucesso", 200, "chave aleatoria válida.")
            return valida
        default:
            valida.validador = Framework.PadronizarRetorno("erro", 400, "Tipo não permitido ou não implementado.")
            valida.mensagem = "Tipo Inválido"
            return valida
    }
}

async function organizaDados(pix, tipo, nomeBanco) {
    let organiza = new Object()
    organiza.pix = pix
    organiza.tipoPix = tipo
    organiza.banco = nomeBanco
    return organiza
}
//#endregion

module.exports = { inserir, listar, listarUm, excluirId, editar, listarTipoPix, Validador, validaPix }