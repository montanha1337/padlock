import {Schema, model} from 'mongoose'

const DevSchema = new Schema({
  secreto:String
})
export default model('Desenvolvimento', DevSchema);