import { Schema, model } from 'mongoose'

const PixSchema = new Schema({
  user: String,
  emailUser: String,
  tipo: String,
  pix: String,
  banco: String
})

export default model('Pix', PixSchema);