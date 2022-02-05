import Banco from '../connect'
import Funcoes from '../../controller/functions'
import Consulta from './consulta'

async function vendedor(token,data) {
  var pessoa
    const user     = await Consulta.verificaUser(token)
    if(user.status== false){
      return user
    }else{
      const cpf = await Consulta.pessoacpf(token, data[`cpf`])
      if(cpf.status == false){
        pessoa= await Consulta.vendedor(token)
        if(pessoa.status== false){
          return pessoa
        }else{
          return pessoa
        }
      }else{
        await Banco.session(`INSERT INTO vendi.pessoa(id_user, cpf) VALUES ((select id_user from Vendi.user u where u.id_user= ${user}),${data["cpf"]});`)
        pessoa = await Banco.session(`select id_pessoa from Vendi.pessoa p where p.id_user= ${user}`)
        await Banco.session(`INSERT INTO vendi.telefone(id_pessoa, telefone,whatsapp) VALUES (${pessoa.rows[0].id_pessoa},${data.telefone},${data["whatsapp"]});`)
        await Banco.session(`INSERT INTO vendi.endereco(id_pessoa,rua,bairro,cidade,numero, cep) VALUES (${pessoa.rows[0].id_pessoa},'${data["rua"]}','${data["bairro"]}','${data["cidade"]}','${data["numero"]}','${data["cep"]}');`)
        await Banco.session(`INSERT INTO vendi.vendedor(id_pessoa,classificacao) VALUES (${pessoa.rows[0].id_pessoa},${data["classificacao"]});`)
        pessoa= await Consulta.vendedor(token)
        if(pessoa.status== false){
          return pessoa
        }else{
          return pessoa
        }
      }
    }
  }
  async function avatar(token,caminho) {
    const user = await Consulta.verificaUser(token) 
    if(user.status== false){
      const erro = Funcoes.padraoErro("não foi possivel identificar o usuario da requisição")
      return erro
    }else{
      const avatar = await Banco.session(`UPDATE vendi."user" SET linkfoto='${caminho}' WHERE id_user=${user};`)
      if(avatar.rowCount==1){
      return true
      }else{
      const erro = Funcoes.padraoErro("não foi encontrado resultados na base de dados")
      return erro
      }
    }
  }
  async function imagemAnuncio(anuncio,caminho) {
      const avatar = await Banco.session(`INSERT INTO vendi.foto(id_anuncio, linkfoto) VALUES ( ${anuncio}, '${caminho}');`)
      if(avatar.rowCount==1){
      return true
      }else{
        const erro = Funcoes.padraoErro("não foi encontrado resultados na base de dados")
        return erro
      }
  }
  async function anuncio(token,anuncio) {
    const user     = await Consulta.verificaUser(token)
    if(user.status== false){
      const erro = Funcoes.padraoErro("não foi possivel identificar o usuario da requisição")
      return erro
    }else{
      const {id_vendedor}  = await Consulta.vendedor(token)
                             await Banco.session(`INSERT INTO vendi.anuncio(id_vendedor, id_categoria, titulo, descricao, valor,dataanuncio, classificacao, latitude, longitude) VALUES (${id_vendedor},${anuncio["categoria"]}, '${anuncio["titulo"]}', '${anuncio["descricao"]}', '${anuncio["valor"]}', '${anuncio["data"]}', ${anuncio["classificacao"]}, '${anuncio["latitude"]}', '${anuncio["longitude"]}');`)
      const novoAnuncio    = await Banco.session(`SELECT MAX(id_anuncio) FROM Vendi.anuncio`)
      const id_anuncio     = novoAnuncio.rows[0].max 
      await imagemAnuncio(id_anuncio,anuncio["file"])
      return novoAnuncio.rows[0].max
    }
}
async function cliente(token,data) {
  const user     = await Consulta.verificaUser(token)
  if(user.status== false){
    const erro = Funcoes.padraoErro("não foi possivel identificar o usuario da requisição")
    return erro
  }else{
    await Banco.session(`INSERT INTO vendi.pessoa(id_user, cpf) VALUES ((select id_user from Vendi.user u where u.id_user= ${user}),'${data["cpf"]}');`)
    const pessoa = await Banco.session(`select id_pessoa from Vendi.pessoa p where p.cpf= '${data["cpf"]}'`)
    await Banco.session(`INSERT INTO vendi.telefone(id_pessoa, telefone,whatsapp) VALUES ((select id_pessoa from Vendi.pessoa p where p.id_pessoa= ${pessoa.rows[0].id_pessoa}),${data.telefone},${data["whatsapp"]});`)
    await Banco.session(`INSERT INTO vendi.endereco(id_pessoa,rua,bairro,cidade,numero, cep) VALUES ((select id_pessoa from Vendi.pessoa p where p.id_pessoa= '${pessoa.rows[0].id_pessoa}'),'${data["rua"]}','${data["bairro"]}','${data["cidade"]}','${data["numero"]}','${data["cep"]}');`)
    const cliente = await Banco.session(`select p.id_pessoa, u.nome, p.cpf, t.telefone, e.cidade, t.whatsapp, e.rua, e.bairro, e.cidade, e.numero, e.cep  from Vendi.user u left outer join Vendi.pessoa   p on p.id_user=   u.id_user left outer join Vendi.telefone t on t.id_pessoa= p.id_pessoa left outer join Vendi.endereco e on e.id_pessoa= p.id_pessoa left outer join Vendi.vendedor v on v.id_pessoa= p.id_pessoa where p.cpf = '${data["cpf"]}' `)
    if(cliente.rows[0]){
      return cliente.rows[0]
    }
    const erro = Funcoes.padraoErro("nao foi encontrado resultados na base de dados para o Cliente")
    return erro
  
  }
}
async function userTeste(password) {
  await Banco.session(`INSERT INTO Vendi.user(email, senha, nome)VALUES ('teste@teste.com',${password},'Desenvolvedor');`)
  return true
}
async function deletaAnuncio(id,token) {
  const vendedor = await Consulta.validaVendedor(token)
  if(vendedor.status== false){
    const erro = Funcoes.padraoErro("não foi possivel identificar o usuario da requisição")
    return erro
  }else{
  var foto = await Banco.session(`select linkfoto from Vendi.foto where id_anuncio =${id}`)
  var anuncio = await Banco.session(`delete from Vendi.foto where id_anuncio = =${id}`)
  foto = await Funcoes.deletaFoto(`${process.cwd()}/uploads/anuncio/${foto.rows[0].linkfoto.substring(38)}`)
  anuncio = await Banco.session(`delete from Vendi.anuncio where id_anuncio = =${id}`)
  return true
  }
}


module.exports = { vendedor, avatar, imagemAnuncio, anuncio, cliente, userTeste, deletaAnuncio}