import { Router } from 'express'
import swaggerUiExpress from 'swagger-ui-express'
import swaggerDocs from './swagger.json'
import Dev from './view/DesenvolvedorRoutes'
import User from './view/UserView'
import Pix from './view/PixView'
import Banco from './view/BancoView'
import Contato from './view/ContatoView'
import Logs from './view/LogsView'

const routes = new Router();//olhar o final da rota 

//#region Documentação

routes.use('/documentacao', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocs))
//#endregion

//#region Pagina Web

routes.use('/web', (req, res) => { res.sendfile(__dirname + '/view/PaginaErro.html') })
routes.use('/web/dev', (req, res) => { res.sendfile(__dirname + '/view/PaginaWeb.html') })
//#endregion

//#region APi

routes.use('/desenvolvimento', Dev) //Rota com com testes unitarios e ferramentas para o desenvolvedor
routes.use('/user', User)//Rota para realizar cadastros e login
routes.use('/pix', Pix) // Rota para realizar consultas e modificações da chave pix.
routes.use('/banco', Banco) // Rota para realizar consultas atualizações e manutenção aos bancos credores na base de dados.
routes.use('/contato', Contato) // rota utilizada para realizar o CRUD da lista de contatos.
routes.use('/log', Logs) // rota para teste de logs no banco.
//#endregion 

module.exports = routes;