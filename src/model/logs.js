import { Schema, model } from 'mongoose'
const LogsSchema = new Schema({
  email: String,
  vezesComErro: String,
  tentativa: String
})
export default model('logs', LogsSchema);