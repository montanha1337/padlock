import FrameWork from './functions'
import AntigaModel from '../model/senhaAntiga'

async function inserir(email, senha) {
    await AntigaModel.insertMany({ email, senha: { senha: senha } })
    return FrameWork.PadronizarRetorno("sucesso", 200, "Senha nunca utilizada.")
}

async function validaAntiga(email, senha) {
    try {
        let result = await AntigaModel.find({ email })
        let iguais = 0

        senha = await FrameWork.ManipularDado("desencripta", senha)

        if (result.length > 0) {
            for (let i = 0; i < result[0].senha.length; i++) {
                let senhabd = result[0].senha[i].senha
                let contsenha = await FrameWork.ManipularDado("desencripta", senhabd)

                if (contsenha.status != 200)
                    return contsenha
                if (contsenha.result == senha.result)
                    iguais++
            }
            if (iguais == 0) {
                senha = await FrameWork.ManipularDado("encripta", senha.result)
                let add = await AntigaModel.updateOne({ email }, { $push: { senha: { senha } } })

                if (add.matchedCount !== 1)
                    return FrameWork.PadronizarRetorno("erro", 400, "Não possivel adicionar a senha.")

                return FrameWork.PadronizarRetorno("sucesso", 200, "Senha nunca utilizada")
            } else
                return FrameWork.PadronizarRetorno("erro", 400, "Senha já utilizada.")
        } else {
            senha = await FrameWork.ValidarDado("senha", senha)
            return await inserir(email, senha.result.senhacripta)
        }

    } catch (e) {
        return PadronizarRetorno("erro", 400, `Erro ao validar senha antiga: ${e.message}`)
    }
}

async function SenhaAntiga(email, senha) {
    try {
        senha = await FrameWork.ValidarDado("senha", senha)

        if (senha.status == 400)
            return senha

        senha = senha.result.senhacripta
        let result = await AntigaModel.find({ email })
        if (result[0] != null) {
            return await validaAntiga(email, senha)
        } else {
            return await inserir(email, senha)
        }
    } catch (e) {
        return FrameWork.PadronizarRetorno("erro", 400, `Erro ao validar senha antiga: ${e.message}`)
    }
}

async function DeletaAntiga(email) {
    let result = await AntigaModel.find({ email })
    if (result[0] != null) {
        await AntigaModel.findOneAndDelete({ email })
    }
}

module.exports = { SenhaAntiga, DeletaAntiga }