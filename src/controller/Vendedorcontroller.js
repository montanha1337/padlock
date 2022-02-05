import express from 'express'
import Funcao from './functions'
import Consulta from '../Banco/migrations/consulta'
import Cadastro from '../Banco/migrations/insert'
import Delete from '../Banco/migrations/deletar'
import Editar from '../Banco/migrations/editar'

const router = express.Router()
router.post('/Inserir', async (req, res, ) => {
    var data = new Object()
    data.cpf=req.body.cpf
    data.telefone=req.body.telefone
    data.whatsapp=req.body.whatsapp
    data.rua=req.body.rua
    data.bairro=req.body.bairro
    data.cidade=req.body.cidade
    data.numero=req.body.numero
    data.cep=req.body.cep
    data.classificacao = 0
    
    var result
    var tokenVenda
    var verifica
    const token1=req.headers.authorization.replace(/^Bearer\s/, '');
    const token = Funcao.atualizajwt(token1)
    if(token.status== false){
        console.log(token.mensagem)
        res.status(401).json({token:null,tokenVenda:null,result:null})
    }else{
        var verifica =await  Funcao.validacpf(data['cpf'])
        if(verifica == false){

            console.log('Erro: Cpf Invalido')
            res.status(401).json({token:null,tokenVenda:null,result:null})
        }else{
            result = await Cadastro.vendedor(token,data)
            if(result.status== false){
                console.log(result)
                if(result.id_vendedor== null){
                    console.log("Erro: não é vendedor")
                    res.status(200).json({token,tokenVenda:null,result})
                }else{
                    tokenVenda = Funcao.gerajwt(result.id_vendedor)
                    res.status(200).json({token,tokenVenda,result})
                }
            }else{
                tokenVenda = Funcao.gerajwt(result.id_vendedor)
                res.status(401).json({token,tokenVenda,result})
            }
        }
    }
})
router.get('/buscar', async (req, res, ) => {
    
    const token1=req.headers.authorization.replace(/^Bearer\s/, '');
    const token = Funcao.atualizajwt(token1) 
    if(token== false){
        console.log({Erro: 'Token Expirado'})
        res.status(401).json({token:null,tokenVendas:null,result:null})
    }else{
        const result = await Consulta.vendedor(token)
        const tokenVendas = Funcao.gerajwt(result.id_vendedor)
        if(token.status == false){
            console.log(token.mensagem)
            res.status(401).json({token:null,tokenVendas:null,result:null})
        }else{
            res.status(200).json({token,tokenVendas,result})
        }
    }
    
})
router.post('/editar', async (req, res, ) => {
    var data = new Object()
    data.nome = req.body.nome
    data.cpf=req.body.cpf
    data.telefone=req.body.telefone
    data.whatsapp=req.body.whatsapp
    data.rua=req.body.rua
    data.bairro=req.body.bairro
    data.cidade=req.body.cidade
    data.numero=req.body.numero
    data.cep=req.body.cep
    console.log(data)
    const token1=req.headers.authorization.replace(/^Bearer\s/, '');
    var token = Funcao.atualizajwt(token1)
    const  vendedor = await Consulta.verificaVendedor(token)
    if(vendedor.status == false){
        console.log(token.mensagem)
        res.status(401).json({token:null,result:null})
    }else{
        if(token.status == false){
            console.log(token.mensagem)
            res.status(401).json({token:null,result:null})
        }else{
            const compare = await Consulta.vendedor(token)
            console.log("Aqui é o compare---------------------->"+compare)
            var result = await Editar.atualizaVendedor('pessoa','cpf',data['cpf'],compare.cpf)
            result  = await Editar.atualizaVendedor('user','nome',data['nome'],compare.nome)
            result  = await Editar.atualizaVendedor('telefone','telefone',data['telefone'],compare.telefone)
            result = await Editar.atualizaVendedor('telefone','whatsapp',data['whatsapp'],compare.whatsapp)
            result = await Editar.atualizaVendedor('endereco','rua',data['rua'],compare.rua)
            result = await Editar.atualizaVendedor('endereco','bairro',data['bairro'],compare.bairro)
            result = await Editar.atualizaVendedor('endereco','cidade',data['cidade'],compare.cidade)
            result = await Editar.atualizaVendedor('endereco','numero',data['numero'],compare.numero)
            result = await Editar.atualizaVendedor('endereco','cep',data['cep'],compare.cep)
            result = await Consulta.vendedor(token)
            const tokenVendas = Funcao.gerajwt(result.id_vendedor)
                if(token.status == false){
                    console.log(token.mensagem)
                    res.status(401).json({token:null,tokenVendas:null,result:null})
                }else{
            res.status(200).json({token,tokenVendas,result})
                }
        }
    }
})

router.put('/classificar', async (req, res, ) => {
    
    const idVendedor=req.body.idVendedor
    var classificacao = req.body.classificacao
        classificacao= await Editar.mediaClassificacao(idVendedor,classificacao)
        if(classificacao.status == false){
            console.log(classificacao.mensagem)
            res.status(401).json({classificacao:null})
        }else{
    res.status(200).json({classificacao})
        }
})

router.delete('/deletar', async (req, res,) => {
    var token = req.headers.authorization.replace(/^Bearer\s/, '')
    token = Funcao.atualizajwt(token)
    const vendedor = await Delete.vendedor(token)
    if (vendedor.status == false) {
        console.log(vendedor.mensagem)
        res.status(200).json({token, vendedor: [] })
    } else {
        res.status(200).json({token, vendedor })
    }
})


module.exports = router