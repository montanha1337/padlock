import { Schema, model } from 'mongoose'

const ConfigSchema = new Schema({
    secreta: String,
    totalBanco: String,
    tipoPix: String
})

export default model('Config', ConfigSchema);