import { Schema, model } from 'mongoose'

const SenhaAntigaSchema = new Schema({
    senha: String,
  })

const SenhaSchema = new Schema({
    email: String,
    senha: [SenhaAntigaSchema]
})

export default model('senhaAntiga', SenhaSchema);