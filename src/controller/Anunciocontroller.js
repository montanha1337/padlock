import express from 'express'
import Funcao from './functions'
import Consulta from '../Banco/migrations/consulta'
import Cadastro from '../Banco/migrations/insert'
import Delete from '../Banco/migrations/deletar'
import Editar from '../Banco/migrations/editar'


const router = express.Router()

router.get('/uploads/:id', async (req, res) => {
    var { id } = req.params
    var filepath = `${process.cwd()}/uploads/anuncio/${id}`
        res.status(200).sendFile(filepath)
});

router.put('/classificar/:id', async (req, res, ) => {
    
    const idAnuncio=req.params.id
    var classificacao = req.body.classificacao
        classificacao= await Editar.mediaClassificacaoAnuncio(idAnuncio,classificacao)
        if(classificacao.status == false){
            console.log(classificacao.mensagem)
            res.status(401).json({classificacao:null})
        }else{
    res.status(200).json({classificacao})
        }
})

router.post('/inserir', async (req, res, next) => {

    var anuncio = Object()
    anuncio.file = req.body.imagem
    anuncio.categoria = req.body.categoria
    anuncio.titulo = req.body.titulo
    anuncio.descricao = req.body.descricao
    anuncio.valor = req.body.valorVenda
    anuncio.classificacao = 1
     const data = new Date();
    const dia = data.getDate()
    const mes = data.getMonth()+1
    const ano = data.getFullYear()
    anuncio.data =(dia+'/'+mes+'/'+ano)
    anuncio.latitude = req.body.latitude
    anuncio.longitude = req.body.longitude
    const token1 = req.headers.authorization.replace(/^Bearer\s/, '');
    const token = Funcao.atualizajwt(token1)
    if (token.status == false) {
        console.log(anuncio.mensagem)
        res.status(401).json({ token: null })
    } else {
        const idAnuncio = await Cadastro.anuncio(token, anuncio)
        if (idAnuncio.status == false) {
            console.log(idAnuncio.mensagem)
            res.status(200).json({ token: null, idAnuncio: null })
        } else {
            res.status(200).json({ token, idAnuncio })

        }
    }
})
router.get('/buscar/:id', async (req, res,) => {

    const { id } = req.params
    const latitude = req.body.latitude
    const longitude = req.body.longitude
    const anuncio = await Consulta.anuncioLista(id,latitude,longitude)
    if (anuncio.status == false) {
        console.log(anuncio.mensagem)
        res.status(200).json({ anuncio: [] })
    } else {
        res.status(200).json({ anuncio })
    }

})
router.delete('/deletar/:id', async (req, res,) => {
    const tokenVenda = req.headers.authorization.replace(/^Bearer\s/, '')
    const { id } = req.params
    const anuncio = await Delete.anuncio(id, tokenVenda)
    if (anuncio.status == false) {
        console.log(anuncio.mensagem)
        res.status(200).json({ anuncio: [] })
    } else {
        res.status(200).json({ anuncio })
    }

})

router.put('/classificar/', async (req, res, ) => {
    
    const idAnuncio=req.body.idAnuncio
    var classificacao = req.body.classificacao
        classificacao= await Editar.mediaClassificacaoAnuncio(idAnuncio,classificacao)
        if(classificacao.status == false){
            console.log(classificacao.mensagem)
            res.status(401).json({classificacao:null})
        }else{
    res.status(200).json({classificacao})
        }
})

router.delete('/deletarfoto/:id', async (req, res,) => {
    const idfoto = req.params.id
    var foto = await Consulta.selectTable('foto','linkfoto','id_foto', idfoto)
    var teste = foto.linkfoto.substring(38)
    console.log(`${process.cwd()}/uploads/anuncio/${foto.linkfoto.substring(38)}`)
    res.json(teste)
})



module.exports = router