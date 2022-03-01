import { Router } from 'express';
import Dev from './view/Desenvolvedor'
import User from './view/user'

const routes = new Router();
//olhar o final da rota 
//web
routes.use('/web',(req,res)=>{ res.sendfile(__dirname+'/view/PaginaErro.html')})
//Api

routes.use('/desenvolvimento',Dev) //Rota com com testes unitarios e ferramentas para o desenvolvedor
routes.use('/user',User)



module.exports = routes;