import Jwt from 'jsonwebtoken'
import ConfigControl from '../controller/config'
import Crypto from 'crypto'

const alg = 'aes-256-ctr'

//#region VIEW
async function ManipularToken(rota, dado) {
    try {
        dado = dado.replace(/^Bearer\s/, '')

        if(!dado)
        return PadronizarRetorno("erro", 400, `Erro ao ${rota} token: token vazio`)


        let retorno
        switch (rota) {
            case "criar":
                retorno = await gerajwt(dado)
                break;
            case "atualizar":
                retorno = await atualizajwt(dado)
                break;
            case "dev-verificar":
                retorno = await verificajwt(dado)
                break;
            case "dev-retornaId":
                retorno = await verificajwt(dado)
                break;
                case "chaveSecreta":
                    let secreto = await secretoFuncao()
                    retorno = secreto == dado ? true : false
                    break;
            default:
                return PadronizarRetorno("erro", 400, "[Framework - ManipularToken] Não foi possivel identificar rotina.")
        }
        if (retorno == false)
            return PadronizarRetorno("erro", 400, `Erro ao ${rota} token. `)


        return PadronizarRetorno("sucesso", 200, retorno)
    } catch (e) {
        return PadronizarRetorno("erro", 400, `Erro ao ${rota} token: ${e.message}`)
    }
}

function PadronizarRetorno(tipo, status, container) {
    try {
        switch (tipo) {
            case "erro":
                return padraoErro(status, container)
            case "sucesso":
                return padraoSucesso(status, container)
            default:
                return PadronizarRetorno("erro", 400, "[Framework - PadronizarRetorno] Não foi possivel identificar rotina.")
        }
    } catch (e) {
        return padraoErro(400, `Erro ao ${tipo} Token: ${e.message}`)
    }
}

async function ValidarDado(tipo, container) {
    try {
        switch (tipo) {
            case "cpf":
                return validaCpf(container)
            case "cnpj":
                return validaCnpj(container)
            case "email":
                return validaEmail(container)
            case "senha":
                return await validaSenha(container)
            default:
                return PadronizarRetorno("erro", 400, "[Framework - ValidarDado] Não foi possivel identificar rotina.")
        }
    } catch (e) {
        return PadronizarRetorno("erro", 400, `Erro ao validar dado: ${e.message}`)
    }
}

function ManipularDado(tipo, container) {
    try {
        switch (tipo) {
            case "encripta":
                return encripta(container)
            case "desencripta":
                return descrypt(container)
            default:
                return PadronizarRetorno("erro", 400, "[Framework - ManipularDado] Não foi possivel identificar rotina.")
        }
    } catch (e) {
        return PadronizarRetorno("erro", 400, `Erro ao encriptar dado: ${e.message}`)
    }
}
//#endregion

//#region PADRAO DE RETORNO
function padraoErro(status, mensagem) {
    return {
        status: status,
        message: mensagem,
        result: null
    }
}

function padraoSucesso(status, dado) {
    return {
        status: status,
        message: "ok",
        result: dado
    }
}
//#endregion

//#region CRIPTOGRAFIA DE DADOS
async function encripta(Dado) {
    try {
        if (!Dado)
            return PadronizarRetorno("erro", 400, "[Framework - Encript] Erro ao encriptar o dado, pois encontra-se vazio.")

        const secreto = await secretoFuncao()
        const cripto = Crypto.createCipher(alg, secreto)
        const retorno = cripto.update(Dado, 'utf8', 'hex')
        return PadronizarRetorno("sucesso", 200, retorno)

    } catch (e) {
        return PadronizarRetorno("erro", 400, `[Framework - Encript] Não foi possivel encriptar o dado: ${e.message}`)
    }
}

async function descrypt(Dado) {
    try {
        if (!Dado)
            return PadronizarRetorno("erro", 400, "[Framework - Descript] Erro ao desencriptar o dado, pois encontra-se vazio.")

        const secreto = await secretoFuncao()
        const descrypt = Crypto.createDecipher(alg, secreto)
        const retorno = descrypt.update(Dado, 'hex', 'utf8')

        return PadronizarRetorno("sucesso", 200, retorno)

    } catch (e) {
        return PadronizarRetorno("erro", 400, "[Framework - Descript] Não foi possivel desencriptar o dado:" + e)
    }
}
//#endregion

//#region CRIPTOGRAFIA DE RETORNO
async function gerajwt(iduser) {
    if (iduser == "" || iduser == null)
        return false

    const carga = iduser
    const secreto = await secretoFuncao()
    const token = Jwt.sign({ carga }, secreto, { expiresIn: "4h" });
    return token
}

async function verificajwt(token) {
    const secreto = await secretoFuncao()
    let verificado = false
    verificado = await Jwt.verify(token, secreto, (err, decoded) => {
        if (decoded)
            return decoded.carga

        return err
    })
    if (verificado.length == undefined)
        verificado = false

    return verificado
}

async function atualizajwt(token) {
    var atualizado = await verificajwt(token)
    if (atualizado == false) {
        return atualizado
    }
    const text = await gerajwt(atualizado)
    return text
}
//#endregion

//#region VALIDAÇÃO DE DADOS
function validaCpf(cpf) {
    var Soma;
    var Resto;
    Soma = 0;
    var i
    if (cpf.length !== 11) {
        return PadronizarRetorno("erro", 400, "CPF não contém numero válido de caracters.")
    }
    for (i = 1; i <= 9; i++) {
        Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) {
        Resto = 0;
    }
    if (Resto != parseInt(cpf.substring(9, 10))) {
        return PadronizarRetorno("erro", 400, "CPF inválido")
    }
    Soma = 0;
    for (i = 1; i <= 10; i++) {
        Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    Resto = (Soma * 10) % 11;
    if ((Resto == 10) || (Resto == 11)) {
        Resto = 0;
    }
    if (Resto != parseInt(cpf.substring(10, 11))) {
        return PadronizarRetorno("erro", 400, "CPF inválido")
    }
    return PadronizarRetorno("sucesso", 200, "CPF valido")
}

function validaCnpj(cnpj) {
    let i
    let resultado
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj == '')
        return PadronizarRetorno("erro", 400, "CNPJ inválido")
    if (cnpj.length !== 14)
        return PadronizarRetorno("erro", 400, "CNPJ inválido")
    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return PadronizarRetorno("erro", 400, "CNPJ inválido")

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return PadronizarRetorno("erro", 400, "CNPJ inválido")

    return PadronizarRetorno("sucesso", 200, "CNPJ inválido")
}

function validaEmail(email) {
    if (email == undefined)
        return PadronizarRetorno("erro", 400, "Email vazio")

    let valida = new Object()
    valida.email = email
    valida.arroba = email.split("@")
    valida.ponto = email.split(".")
    valida.tamanho = valida.email.length
    valida.arrobaTam = valida.arroba.length
    valida.pontoTam = valida.ponto.length
    valida.teste = valida.arroba[0].length
    for (let i = 0; i < valida.tamanho; i++) {
        if (valida.email[i] == '@' && valida.arrobaTam !== 1 && valida.pontoTam !== 1 && valida.tamanho > 11 && valida.arroba[0].length >= 6) {
            for (let i = 0; i < valida.pontoTam; i++) {
                if (valida.ponto[i] == "com") {
                    valida.status = 200
                    return PadronizarRetorno("sucesso", 200, { email: valida.email })
                }
            }
        }
    }
    return PadronizarRetorno("erro", 400, "Email Inválido")
}

async function validaSenha(senha) {
    let valida = new Object()
    valida.senha = senha
    valida.maiuscula = senhaMaiuscula(senha)
    valida.mensagem = "Senha Incorreta: A senha deve conter "
    valida.mensagem1 = "números"
    valida.mensagem2 = "letras maiúsculas"
    valida.numero = false
    valida.letraMaiuscula = false
    if (senha.length >= 8) {
        for (let i = 0; i < senha.length; i++) {
            if (senha[i] == 1 || senha[i] == 2 || senha[i] == 3 || senha[i] == 4 || senha[i] == 5 || senha[i] == 6 || senha[i] == 7 || senha[i] == 8 || senha[i] == 9 || senha[i] == 0) {
                valida.numero = true
            }
            if (valida.senha[i] == valida.maiuscula[i] && valida.maiuscula[i] != "*") {
                valida.letraMaiuscula = true
            }
        }
        if (valida.numero == true && valida.letraMaiuscula == true) {
            valida.cripto = await ManipularDado('encripta', senha)
            valida.dado = { senha: valida.senha, senhacripta: valida.cripto.result }
            return PadronizarRetorno("sucesso", 200, valida.dado)
        } else {
            if (valida.numero == false && valida.letraMaiuscula != false) valida.mensagem += valida.mensagem1 + "."
            if (valida.numero != false && valida.letraMaiuscula == false) valida.mensagem += valida.mensagem2 + "."
            if (valida.numero == false && valida.letraMaiuscula == false) valida.mensagem += valida.mensagem1 + " e " + valida.mensagem2 + "."
            return PadronizarRetorno("erro", 400, valida.mensagem)
        }
    } else {
        return PadronizarRetorno("erro", 400, "Senha deve conter 8 digitos")
    }
}
//#endregion

//#region UTILITÁRIOS
function senhaMaiuscula(senha) {
    senha = senha.split("0").join("*")
    senha = senha.split("1").join("*")
    senha = senha.split("2").join("*")
    senha = senha.split("3").join("*")
    senha = senha.split("4").join("*")
    senha = senha.split("5").join("*")
    senha = senha.split("6").join("*")
    senha = senha.split("7").join("*")
    senha = senha.split("8").join("*")
    senha = senha.split("9").join("*")
    return senha.toUpperCase()
}

async function secretoFuncao() {
    const secreto = await ConfigControl.palavra()
    return secreto
}

const adminOnly = async (req, res, next) => {
    const secreto = await secretoFuncao()
    let chave = req.headers.authorization
    chave = chave.replace(/^Bearer\s/, '')
    if (secreto === chave) {
        next();
    } else {
        res.status(401).json(PadronizarRetorno("erro",401,"Acesso não permitido para esta conexão, contate o desenvolvedor."));
    }
}
//#endregion

module.exports = { ManipularToken, PadronizarRetorno, ValidarDado, ManipularDado, adminOnly }