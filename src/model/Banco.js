import { Schema, model } from 'mongoose'
const BancoSchema = new Schema({
  nome: String,
  code: String,
  fullNome: String
})
export default model('banco', BancoSchema);