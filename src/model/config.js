import {Schema, model} from 'mongoose'
const ConfigSchema = new Schema({
    secreta:String,
    totalBanco: String
})
export default model('Config', ConfigSchema);