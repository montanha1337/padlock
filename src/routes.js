import { Router } from 'express';
import Dev from './view/DesenvolvedorRoutes'
import User from './view/UserView'
import Pix from './view/PixView'
import Banco from './view/BancoView'
import Contato from './view/ContatoView';
import swaggerUiExpress from 'swagger-ui-express';
import swaggerDocs from './swagger.json';

const routes = new Router();
//olhar o final da rota 
//documentação
routes.use('/documentacao',swaggerUiExpress.serve,swaggerUiExpress.setup(swaggerDocs))
//web
routes.use('/web',(req,res)=>{ res.sendfile(__dirname+'/view/PaginaErro.html')})
//Api

routes.use('/desenvolvimento',Dev) //Rota com com testes unitarios e ferramentas para o desenvolvedor
routes.use('/user',User)//Rota para realizar cadastros e login
routes.use('/pix',Pix) // Rota para realizar consultas e modificações da chave pix.
routes.use('/banco',Banco) // Rota para realizar consultas atualizações e manutenção aos bancos credores na base de dados.
routes.use('/contato',Contato) // rota utilizada para realizar o CRUD da lista de contatos.


module.exports = routes;