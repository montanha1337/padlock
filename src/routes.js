import { Router } from 'express';
import Dev from './view/DesenvolvedorRoutes'
import User from './view/UserView'
import Pix from './view/PixView'
import Banco from './view/BancoView'

const routes = new Router();
//olhar o final da rota 
//web
routes.use('/web',(req,res)=>{ res.sendfile(__dirname+'/view/PaginaErro.html')})
//Api

routes.use('/desenvolvimento',Dev) //Rota com com testes unitarios e ferramentas para o desenvolvedor
routes.use('/user',User)//Rota para realizar cadastros e login
routes.use('/pix',Pix) // Rota para realizar consultas e modificações da chave pix.
routes.use('/banco',Banco) // Rota para realizar consultas atualizações e manutenção aos bancos credores na base de dados.


module.exports = routes;