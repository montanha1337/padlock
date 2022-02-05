import express from 'express';
import routes from'./routes';
import mongoose from 'mongoose';

var cors = require('cors')
var app = express()

app.use(cors())

class App{
  constructor(){
    this.server=express();
   //  conexão com o banco id:root senha:admin
   //  https://data.mongodb-api.com/app/data-nhsha/endpoint/data/beta
    mongoose.connect('mongodb+srv://root:<admin>@pixalock.5fnrf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.middlewares();
    this.routes();
  }
  middlewares(){
      this.server.use(express.json());
  }
  routes(){
      this.server.use(routes)
  }

}
module.exports=new App().server;