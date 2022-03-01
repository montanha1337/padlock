import Funcao from './functions'
import UserModel from '../model/user';


async function inserir(nome,email,senha){
    let result
        result = await login(email,senha)
        if(result.status == false){
            if(result.mensagem =='Usuario não cadastrado' ){
                //caso não tenha logado mas anão tem cadastrado
                result = await UserModel.create({email, nome, senha})
                result = await login(email,senha)
                console.log(result)
                return result
            }else{
                //caso não tenha logado, mas já existe
                return result
            }
          }else{ 
              //caso seja logado 
            return result
          }
}
//result = await UserModel.create({email, nome, senha})
async function excluirUm(email){
    let result = await UserModel.findOneAndDelete({email})
    console.log({result})
    return result 
}

async function excluirId(id){
    console.log(id)
    let result = await UserModel.findByIdAndDelete(id)
    console.log(result)
    return result 
}

async function listar(){
    let result = await UserModel.find({})
    if(result){
        return result
        }else{
            return Funcao.padraoErro('Lista Vazia')
        }
}
async function login(email,senha){
    let token
    let result = await UserModel.findOne({email})
    if(result){
        if(result.senha==senha){
            token = await Funcao.gerajwt(result._id)
            return {token}
        }else{
            return Funcao.padraoErro('Senha incorreta')
        }
    }else{
        return Funcao.padraoErro('Usuario não cadastrado')
    }
}



module.exports = {inserir, excluirUm, excluirId, listar, login}