import { Router } from 'express';
import Dev from './controller/Desenvolvedor'

const routes = new Router();
//olhar o final da rota 
//web
routes.use('/web',(req,res)=>{ res.sendfile(__dirname+'/web/PaginaErro.html')})
//Api

routes.use('/desenvolvimento',Dev) //Rota com ferramentas para auxiliar o frontend e demais areas



module.exports = routes;