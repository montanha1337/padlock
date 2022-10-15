import { Schema, model } from 'mongoose'

const ConfigPixSchema = new Schema({
    tipoPix: String
})

export default model('ConfigPix', ConfigPixSchema);