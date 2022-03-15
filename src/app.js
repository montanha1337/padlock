import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import mongoose from 'mongoose';

var cors = require('cors')
var app = express()
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  //Quais são os métodos que a conexão pode realizar na API
  req.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
  app.use(cors())
  next
})

class App {
  constructor() {
    this.server = express();
    // conexão com o banco id:root senha:admin
    // https://data.mongodb-api.com/app/data-nhsha/endpoint/data/beta
    mongoose.connect('mongodb+srv://root:matheus@pixalock.5fnrf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.server.use(express.json());
  }
  routes() {

    this.server.use(routes)
  }

}
module.exports = new App().server;