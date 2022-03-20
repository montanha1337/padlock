import Funcao from './functions'
import UserControl from './userController'
import LogModel from '../model/logs'

async function inserirErroAcesso(email){
 let valida = UserControl.listarUmEmail(email)
 if(valida){
     return true
 }else
 return false

}

module.exports = {}