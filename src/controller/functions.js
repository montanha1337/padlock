import Jwt from 'jsonwebtoken'
import Chave from '../model/connect'
import bcrypt from 'bcrypt'

var salt = bcrypt.genSaltSync(10)

function padraoErro(mensagem){
    var erro= Object()
    erro.mensagem=mensagem
    erro.status=false
    return erro
}


function gerajwt(iduser){
    const token = Jwt.sign({iduser}, Chave.secreto, {expiresIn: "30 days" });
    return token
}
function verificajwt(token){
    var verificado = Jwt.verify(token,Chave.secreto, (err, decoded) =>{
        if(decoded) {
        return decoded.iduser
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



module.exports = {padraoErro, gerajwt, verificajwt,atualizajwt}