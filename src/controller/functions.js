import Jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import ConfigControl from '../controller/config'

var salt = bcrypt.genSaltSync(10)
async function secretoFuncao(){
    const secreto = await ConfigControl.palavra()
    return secreto
}


function padraoErro(mensagem){
    var erro= Object()
    erro.mensagem=mensagem
    erro.status=false
    return erro
}


async function gerajwt(iduser){
    const carga = iduser
    const secreto = await secretoFuncao()
    const token = Jwt.sign({carga}, secreto, {expiresIn: "1h" });
    return token
}
async function geraSenha(senha){
    const carga = senha
    const secreto = await secretoFuncao()
    const token = Jwt.sign({carga}, secreto, {expiresIn: "2 days" });
    return token
}
async function verificajwt(token){
    const secreto = await secretoFuncao()
    var verificado = Jwt.verify(token,secreto, (err, decoded) =>{
        if(decoded) {
            return decoded.carga
        }
        return false
    } )
    return verificado
}
function atualizajwt(token){
    var atualizado = verificajwt(token)
    if(atualizado == false){
        return false
    }
         const text=gerajwt(atualizado)
        return text
}

async function encripta(dado){
    const carga = dado
    const secreto = await secretoFuncao()
    const token = Jwt.sign({carga}, secreto, {expiresIn: "5000 days" });
    return token
}

function validaCpf(cpf){
    var Soma;
    var Resto;
    Soma = 0;
    var i
    if(cpf.length !==11){
        return false
    }
  if (cpf == "00000000000") {
      return false
}    
  for (i=1; i<=9; i++) {
      Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
  }
  Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  {
        Resto = 0;
    }
    if (Resto != parseInt(cpf.substring(9, 10)) ){ 
        return false;
    }
    Soma = 0;
    for (i = 1; i <= 10; i++) {
        Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  {
        Resto = 0;
    }
    if (Resto != parseInt(cpf.substring(10, 11) ) ) {
        return false
    }
    return true;
}

function validaCnpj(cnpj){
    let i
    let resultado
    cnpj = cnpj.replace(/[^\d]+/g,'');
 
    if(cnpj == '') return false;
     
    if (cnpj.length !== 14)
        return false;
 
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return false;
         
    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0,tamanho);
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
    numeros = cnpj.substring(0,tamanho);
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
function validaEmail(email){
    let valida = new Object()
    valida.email = email.split("")
    valida.arroba = email.split("@")
    valida.ponto = email.split(".")
    valida.tamanho = valida.email.length
    valida.arrobaTam = valida.arroba.length
    valida.pontoTam = valida.ponto.length
    valida.teste = valida.arroba[0].length
    valida.retorno = false

    for(let i = 0; i < valida.tamanho; i++){
        if(valida.email[i] == '@' && valida.arrobaTam !==1 && valida.pontoTam !== 1 && valida.tamanho > 11 && valida.arroba[0].length>=6){
            for(let i = 0; i < valida.pontoTam; i++){
                if(valida.ponto[i] == "com"){
                    valida.retorno = true
                    return valida.retorno
                }
            }
            
        }
    }
    return valida.retorno
}


async function validaSenha(senha){
    let valida = new Object()
    valida.maiuscula=senha.toUpperCase()
    valida.senha= senha
    valida.especial=true
    if(senha.length>=8){
        for(let i = 0; i < senha.length; i++){
            if(senha[i]==1||senha[i]==2||senha[i]==3||senha[i]==4||senha[i]==5||senha[i]==6||senha[i]==7||senha[i]==8||senha[i]==9||senha[i]==0){
                if(valida.especial==true){
                    if(senha[i] == valida.maiuscula[i]){
                        valida.cripto= await geraSenha(senha)
                        return {senha:valida.senha,senhacripta:valida.cripto,valida:true}
                    }
                }
            }
        }
    }
    return padraoErro("senha inválida")
}


module.exports = {padraoErro, gerajwt, verificajwt,atualizajwt,encripta,validaCpf,validaCnpj,validaEmail,validaSenha}