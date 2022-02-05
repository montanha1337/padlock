import {Pool,Client} from 'pg'

// criar conexão com a base de dados
// deve-se ao instalar o banco de dados colocar #abc123# no password

const client = new Client({
  connectionString: 'postgres://icirkndvgufckf:7633aa887df24ee847e024a4ec3439fc03d0b3ebeef316de97d5c059af711bfb@ec2-54-210-226-209.compute-1.amazonaws.com:5432/d9p9dq884n3h5t',
  ssl: {
    rejectUnauthorized: false,
    ssl:true
  },
  connectionTimeoutMillis: 1500
})

//Funçao para estabelecer a conexão
client.connect();


async function session(query) {
  console.log('Session: '+query)
  var conexao=client.query(query);
  return conexao
}
const secreto = 'Desenvolvemosfuturo'


module.exports = { session, client, secreto }
