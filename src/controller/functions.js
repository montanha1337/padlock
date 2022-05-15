import Jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import ConfigControl from '../controller/config'

function padraoErro(mensagem) {
    return {
        status: 400,
        message: mensagem,
        result: null
    }
}

function padraoSucesso(dado) {
    return {
        status: 200,
        message: "ok",
        result: dado
    }
}

async function secretoFuncao() {
    const secreto = await ConfigControl.palavra()
    return secreto
}

async function gerajwt(iduser) {
    if (iduser != "") {
        const carga = iduser
        const secreto = await secretoFuncao()
        const token = Jwt.sign({ carga }, secreto, { expiresIn: "1h" });
        return token
    }
    return padraoErro("Não foi possivel gerar o token id vazio")
}

async function geraSenha(senha) {
    const carga = senha
    const secreto = await secretoFuncao()
    const token = Jwt.sign({ carga }, secreto, { expiresIn: "30 days" });
    return token
}

async function verificajwt(token) {
    const secreto = await secretoFuncao()
    var verificado = Jwt.verify(token, secreto, (err, decoded) => {
        if (decoded) {
            return decoded.carga
        }
        return false
    })
    return verificado
}

async function atualizajwt(token) {
    var atualizado = verificajwt(token)
    if (atualizado == false) {
        return atualizado
    }
    const text = await gerajwt(atualizado)
    return text
}

async function encripta(dado) {
    const carga = dado
    const secreto = await secretoFuncao()
    const token = Jwt.sign({ carga }, secreto, { expiresIn: "5000 days" });
    return token
}

function validaCpf(cpf) {
    var Soma;
    var Resto;
    Soma = 0;
    var i
    if (cpf.length !== 11) {
        return false
    }
    for (i = 1; i <= 9; i++) {
        Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) {
        Resto = 0;
    }
    if (Resto != parseInt(cpf.substring(9, 10))) {
        return false;
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
        return false
    }
    return true;
}

function validaCnpj(cnpj) {
    let i
    let resultado
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj == '') 
        return false;
    if (cnpj.length !== 14)
        return false;
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
        return false;

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
        return false;
    return true;
}

function validaEmail(email) {
    if (email != undefined) {
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
                        return padraoSucesso({ email: valida.email })
                    }
                }
            }
        }
        return padraoErro("Email Inválido")
    }
    return padraoErro("Email impóssivel de verificar")
}

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
            valida.cripto = await geraSenha(senha)
            valida.dado = { senha: valida.senha, senhacripta: valida.cripto }
            return padraoSucesso(valida.dado)
        } else {
            if (valida.numero == false && valida.letraMaiuscula != false) valida.mensagem += valida.mensagem1 + "."
            if (valida.numero != false && valida.letraMaiuscula == false) valida.mensagem += valida.mensagem2 + "."
            if (valida.numero == false && valida.letraMaiuscula == false) valida.mensagem += valida.mensagem1 + " e " + valida.mensagem2 + "."
            return padraoErro(valida.mensagem)
        }
    } else {
        return padraoErro("Senha deve conter 8 digitos")
    }
}

module.exports = { padraoErro, padraoSucesso, gerajwt, verificajwt, atualizajwt, encripta, validaCpf, validaCnpj, validaEmail, validaSenha }