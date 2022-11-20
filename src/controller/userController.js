import Framework from './functions'
import UserModel from '../model/user'
import LogControl from './LogController'
import AntigaControl from './SenhaAntigaController'

//#region CRUD
async function inserir(nome, email, senha) {
    try {
        let verificaCadastro
        let historicoSenha

        verificaCadastro = await login(email, senha)
        if (verificaCadastro.message == "Usuário não cadastrado") {
            historicoSenha = await AntigaControl.SenhaAntiga(email, senha)
            if (historicoSenha.status != 200)
                return historicoSenha

            senha = await Framework.ValidarDado("senha", senha)
            if (senha.status != 200)
                return senha

            await UserModel.create({ email: email, nome: nome, senha: senha.result.senhacripta })
            verificaCadastro = await login(email, senha.result.senha)
            return verificaCadastro
        } else {
            return verificaCadastro
        }
    } catch (e) {
        return Framework.PadronizarRetorno("erro", 400, `Erro ao cadastrar usuário: ${e.message}`)
    }
}

async function login(email, senha) {
    try {
        let oSenhaBd
        let oBuscarUser
        let token
        oBuscarUser = await UserModel.findOne({ email })
        if (oBuscarUser == "" || oBuscarUser == null)
            return Framework.PadronizarRetorno("erro", 400, "Usuário não cadastrado")


        oSenhaBd = await Framework.ManipularDado("desencripta", oBuscarUser.senha)
        if (oSenhaBd.status != 200)
            return oSenhaBd

        if (oSenhaBd.result == senha) {
            oBuscarUser = oBuscarUser._id.toString()
            token = await Framework.ManipularToken("criar", oBuscarUser)
            await LogControl.deleta(email)
            return Framework.PadronizarRetorno("sucesso", 200, { token: token.result })
        } else {
            await LogControl.InserirLog(email)
            return Framework.PadronizarRetorno("erro", 400, "Senha Incorreta")
        }
    } catch (e) {
        return Framework.PadronizarRetorno("erro", 400, `Erro ao realizar login: ${e.message}`)
    }
}

async function AlterarSenha(email, senha, senhaAntiga) {
    let acesso
    let senhaEncripta = await Framework.ManipularDado("encripta",senha)
    if (senhaAntiga == '' || senhaAntiga == null || senhaAntiga == undefined) {
        acesso = await login(email, senha)
        if (acesso.message == "Senha Expirada") {
            let result = await UserModel.findOne({ email })
            if (result) {
                await UserModel.findByIdAndUpdate({ _id: result._id }, { senha: senhaEncripta.result })
                acesso = await login(email, senha)
                return acesso
            }
        } else if (acesso.message == "Senha Incorreta") {
            let result = await UserModel.findOne({ email })
            if (result) {
                await UserModel.findByIdAndUpdate({ _id: result._id }, { senha: senhaEncripta.result })
                acesso = await login(email, senha)
                return acesso
            }
        }
        return acesso
    } else {
        let historicoSenha = await AntigaControl.SenhaAntiga(email, senha)
        if (historicoSenha.status == 400) {
            return historicoSenha
        }
        let result = await UserModel.findOne({ email })
        if (result) {
            await UserModel.findByIdAndUpdate({ _id: result._id }, { senha: senhaEncripta })
            acesso = await login(email, senha)
            return acesso
        }
        return Framework.PadronizarRetorno("erro", 400, "Ops, Algo deu errado!!")
    }
}

async function excluirId(token) {
    try {
        let user = await Framework.ManipularToken("retornaId",token)

        if(user.status != 200)        
        return user

        let email = await UserModel.findById(user.result)
        let result = await UserModel.findByIdAndDelete(user.result)

        await AntigaControl.DeletaAntiga(email.email)
        return Framework.PadronizarRetorno("sucesso", 200, result)
    } catch (e) {
        return Framework.PadronizarRetorno("erro", 400, `Erro ao apagar usuário: ${e.message}`)
    }
}

async function listarUm(user) {
    let formata = new Object();
    let user1 = await UserModel.findById(user)
    formata.id = user
    formata.nome = await Framework.verificajwt(user1.nome)
    formata.email = await Framework.verificajwt(user1.email)
    return Framework.PadronizarRetorno("sucesso", 200, formata)
}

//#endregion

//#region DESENVOLVIMENTO
async function excluirUm(email,chave) {
    chave = await Framework.ManipularToken("chaveSecreta",chave)

    if(chave.status !=200)
        return Framework.PadronizarRetorno("erro", 400, "Acesso não permitido, contate o desenvolvedor para quaisquer duvidas.")

    let result = await UserModel.findOneAndDelete({ email })
    return result
}

async function listar() {
    let result = await UserModel.find({})
    if (result) {
        return Framework.PadronizarRetorno("sucesso", 200, result)
    } else {
        return Framework.PadronizarRetorno("erro", 400, "Lista Vazia")
    }
}
//#endregion

async function Validador(token, nome, email, senha, senhaAntiga, rota) {
    let validartoken = "sucesso"

    //#region TRATAMENTO DE DADOS
    token = await Framework.ManipularToken("atualizar", token)
    if (token.status != 200)
        validartoken = "erro"
    //#endregion

    //#region CHAMADA DE METODOS
    switch (rota) {
        case "inserir":
            await LogControl.deleta(email)
            return await inserir(nome, email, senha)

        case "login":
            return await login(email, senha)

        case "AlterarSenha":
            await LogControl.deleta(email)
            return await AlterarSenha(email, senha, senhaAntiga)

        case "deleteId":
            await LogControl.deleta(email)
            await AntigaControl.deletaAntiga(email)
            return await excluirId(token)

        case "listarUm":
            return await listarUm(token)

        case "atualizaToken":
            return Framework.PadronizarRetorno(validartoken, token.status, token.status == 200 ? token.result : token.message)

        default:
            return Framework.PadronizarRetorno("erro", 400, "[Api] Erro ao informar a rota.")
    }
    //#endregion
}
module.exports = { Validador, excluirUm, listar}