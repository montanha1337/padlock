import Funcao from './functions'
import UserModel from '../model/user';


async function inserir(nome,email,senha){
    let result
    senha=Funcao.encripta(senha)
        result = await login(email,senha)
        if(result.status == false){
            if(result.mensagem =='Usuario não cadastrado' ){
                //caso não tenha cadastro
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
async function excluirUm(email){
    let result = await UserModel.findOneAndDelete({email})
    console.log({result})
    return result 
}

async function excluirId(user){
    user =await Funcao.verificajwt(user)
    if(user==false){
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    let result = await UserModel.findByIdAndDelete(user)
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
async function listarUm(user){
    user =await Funcao.verificajwt(user)
    if(user==false){
        return Funcao.padraoErro("Usuario não identificado!!!")
    }
    user= await UserModel.findById(user)
    console.log(user)
    return user
}



module.exports = {inserir, excluirUm, excluirId, listar, login,listarUm}