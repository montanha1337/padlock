import {Schema, model} from 'mongoose'
const ContatoSchema = new Schema({
  id: String,
  IdUser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  nome: String,
  banco:String,
  pix:String,
})
export default model('Contato', ContatoSchema);