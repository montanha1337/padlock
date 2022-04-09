import { Schema, model } from 'mongoose'
const UserSchema = new Schema({
  id: String,
  email: String,
  nome: String,
  senha: String,
})

export default model('User', UserSchema);