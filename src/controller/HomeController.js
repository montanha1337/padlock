import express from 'express'
import Funcao from './functions'
import Consulta from '../Banco/migrations/consulta'
import Cadastro from '../Banco/migrations/insert'

const router = express.Router()

router.get('/categoria', async (req, res, ) => {
    const categoria = await Consulta.categoria()
    if(categoria.status == false){
        console.log(categoria.mensagem)
        res.status(401).json({categoria:[]})
    }else{
        res.status(200).json({categoria})
    }
})
router.post('/perfil', async (req, res, ) => {
    const tokenreq= req.headers.authorization.replace(/^Bearer\s/, '');
    const token = Funcao.atualizajwt(tokenreq) 
    if(token.status == false){
        console.log(token.mensagem)
        res.status(401).json({token:[],perfil:[]})
    }else{
        var perfil = await Consulta.perfil(token)
        if(token.status == false){
            console.log(token.mensagem)
            res.status(401).json({token:[],perfil:[]})
        }else{
        var temp=perfil.nome.split(" ");
        perfil.nome = temp[0]
        res.status(200).json({token,perfil})
        }
    }
})
router.post('/anuncio/:categoria/:pagina', async (req, res, ) => {
    const { categoria } = req.params
    const { pagina } = req.params
    const latitude = req.body.latitude
    const longitude = req.body.longitude
    
    if(latitude && longitude){
    const anuncio = await Consulta.anuncio(categoria,pagina,latitude,longitude)
    if(anuncio.status == false){
        console.log(anuncio.mensagem)
        res.status(401).json({anuncio:[]})
    }else{
        res.status(200).json({anuncio})
    }
}else{
    res.status(400).json("Erro ao buscar por localização")
}
})


module.exports = router