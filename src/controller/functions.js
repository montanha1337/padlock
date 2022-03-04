import Jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

var salt = bcrypt.genSaltSync(10)
const secreto = 'e27b5c71f4a74a0a6a484e3d00fa5489f720938d'

function padraoErro(mensagem){
    var erro= Object()
    erro.mensagem=mensagem
    erro.status=false
    return erro
}


function gerajwt(iduser){
    const carga = iduser
    const token = Jwt.sign({carga}, secreto, {expiresIn: "1h" });
    return token
}
function verificajwt(token){
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

function encripta(dado){
    const carga = dado
    const token = Jwt.sign({carga}, secreto, {expiresIn: "5000 days" });
    return token
}


module.exports = {padraoErro, gerajwt, verificajwt,atualizajwt,encripta}