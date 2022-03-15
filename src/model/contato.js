import { Schema, model } from 'mongoose'

const PixSchema = new Schema({
  IdUser: {
    type: Schema.Types.ObjectId,
    ref: 'contatos'
  },
  pix: String,
  tipo: String
})


const ContatoSchema = new Schema({
  IdUser: String,
  email: String,
  nome: String,
  pix: [PixSchema],
})
export default model('Contato', ContatoSchema);