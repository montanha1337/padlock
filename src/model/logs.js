import { Schema, model } from 'mongoose'
const LogsSchema = new Schema({
  email: String,
  tentativa: Number,
  data: String
})
export default model('logs', LogsSchema);