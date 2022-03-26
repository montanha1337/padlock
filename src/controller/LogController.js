import LogModel from '../model/logs'
import Funcao from './functions'


async function ValidaLogin(email) {

    let result = new Object()
    let tentativa = 1
    const d = new Date();
    let minutes = d.getMinutes();
    let data2
    let data = minutes
        console.log(data)
    result = Funcao.validaEmail(email)
    if (result.status == false) {
        return Funcao.padraoErro(result.mensagem)
    }
    result = await LogModel.find({ email })
    if (result) {
        
        if (result == "") {
            data2 = result[0].data - data
            result = await LogModel.create({ email, tentativa, data })//usuario apenas errou
            return result.status=true
        } else if (result[0].email == email && result[0].tentativa >= 3) {//usuario bloqueado
            return Funcao.padraoErro("Usuario Bloqueado")
        } else { //usuario meio termo
            tentativa= result[0].tentativa+tentativa
            if(tentativa==3){
                await LogModel.findByIdAndUpdate(result[0].id,{tentativa,data})
                return Funcao.padraoErro(`Falta Apenas ${3-tentativa} tentativa`)
            }
            await LogModel.findByIdAndUpdate(result[0].id,{tentativa})
            return Funcao.padraoErro(`Falta Apenas ${3-tentativa} tentativa`)
        }
    }
}




module.exports = { ValidaLogin }