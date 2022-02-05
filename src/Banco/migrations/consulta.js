import Banco from '../connect'
import Funcoes from '../../controller/functions'

async function analizaLatitude(latitude, longitude) {
  var dados = Object()
  dados.latitude=latitude[0]+latitude[1]+latitude[2]+latitude[3]+latitude[4]
  dados.longitude=longitude[0]+longitude[1]+longitude[2]+longitude[3]+longitude[4]
  dados.localizacao = await Banco.session(`select m.latitude, m.longitude, m.municipio from vendi.coodmunicipio m  where m.latitude like '${dados.latitude}%' and longitude like '${dados.longitude}%' order by id_coodmunicipio desc`)
  dados.distancia = Funcoes.distanciaLatLong(latitude, longitude, dados.localizacao.rows[0].latitude, dados.localizacao.rows[0].longitude)
  dados.localizacao = dados.localizacao.rows[0]
  return dados
}


async function verificaUser(token) {
  const iduser     = Funcoes.verificajwt(token)
  if(iduser== false){
    const erro = Funcoes.padraoErro("não foi possivel identificar o usuario da requisição")
    return erro
  }else{
    const user = await Banco.session(`select * from Vendi.user u where  u.id_user = ${iduser}`)
    if(user.rows[0]){
      return user.rows[0].id_user
    }
    const erro = Funcoes.padraoErro("usuario nao encontrado na base de dados")
    return erro
  }

}
async function vendedor(token) {
  const user     = await verificaUser(token)
  
  if(user.status== false){
    const erro = Funcoes.padraoErro(`não foi possivel identificar o usuario da requisição`)
    return erro
  }else{
    
    const vendedor    = await Banco.session(`select v.id_vendedor, u.nome, p.cpf, t.telefone, e.cidade, t.whatsapp, e.rua, e.bairro, e.cidade, e.numero, e.cep, v.classificacao from Vendi.user u left outer join Vendi.pessoa   p on p.id_user=   u.id_user left outer join Vendi.telefone t on t.id_pessoa= p.id_pessoa left outer join Vendi.endereco e on e.id_pessoa= p.id_pessoa left outer join Vendi.vendedor v on v.id_pessoa= p.id_pessoa where u.id_user = ${user} `)
    if(vendedor.rows[0]){
      return vendedor.rows[0]
    }
    const erro = Funcoes.padraoErro(`não foi encontrado resultados na base de dados`)
    return erro
  }
}
  async function cliente(token) {
    const user     = await verificaUser(token)
    if(user.status== false){
      const erro = Funcoes.padraoErro("nao foi possivel identificar o usuario da requisição")
      return erro
    }else{
      const cliente = await Banco.session(`select p.id_pessoa, u.nome, p.cpf, t.telefone, e.cidade, t.whatsapp, e.rua, e.bairro, e.cidade, e.numero, e.cep  from Vendi.user u left outer join Vendi.pessoa   p on p.id_user=   u.id_user left outer join Vendi.telefone t on t.id_pessoa= p.id_pessoa left outer join Vendi.endereco e on e.id_pessoa= p.id_pessoa left outer join Vendi.vendedor v on v.id_pessoa= p.id_pessoa where u.id_user = ${user}`)
      if(cliente.rows[0]){
        return cliente.rows[0]
      }
      const erro = Funcoes.padraoErro("nao foi encontrado resultados na base de dados para o Cliente")
      return erro
    }
  }
  async function pessoacpf(token,cpf) {
    var json = Object ()
    const user     = await verificaUser(token)
    if(user.status== false){
      const erro = Funcoes.padraoErro("nao foi possivel identificar o usuario da requisição")
      return erro
    }else{
      var pessoa = await Banco.session(`select p.cpf from Vendi.user u left outer join Vendi.pessoa   p on p.id_user=   u.id_user left outer join Vendi.telefone t on t.id_pessoa= p.id_pessoa left outer join Vendi.endereco e on e.id_pessoa= p.id_pessoa left outer join Vendi.vendedor v on v.id_pessoa= p.id_pessoa where u.id_user = ${user}`)
      if(pessoa.rows==null){
        pessoa = Banco.session(`select p.cpf from Vendi.user u left outer join Vendi.pessoa   p on p.id_user=   u.id_user left outer join Vendi.telefone t on t.id_pessoa= p.id_pessoa left outer join Vendi.endereco e on e.id_pessoa= p.id_pessoa left outer join Vendi.vendedor v on v.id_pessoa= p.id_pessoa where p.cpf = '${cpf}' `)
        if(pessoa.rows[0].cpf){
          const erro = Funcoes.padraoErro('Cpf não encontrado.')  
          return erro
        }else{
          const erro = Funcoes.padraoErro('Cpf já existe para outro usuário.')  
          erro.status = true
          return erro
        }
      }else{
        if(pessoa.rows[0].cpf == cpf){
          const erro = Funcoes.padraoErro('Cpf já existe para o usuário.')  
          return erro
        }else{
          pessoa = Banco.session(`select p.cpf from Vendi.user u left outer join Vendi.pessoa   p on p.id_user=   u.id_user left outer join Vendi.telefone t on t.id_pessoa= p.id_pessoa left outer join Vendi.endereco e on e.id_pessoa= p.id_pessoa left outer join Vendi.vendedor v on v.id_pessoa= p.id_pessoa where p.cpf = '${cpf}' `)
          if(pessoa.rows == null){
            const erro = Funcoes.padraoErro('Cpf já existe para o usuário.')  
            erro.status = true
            return erro
          }else{
            const erro = Funcoes.padraoErro('Cpf já existe para outro usuário.')  
            return erro
          }
      }
    }
  }
}
  async function categoria() {
    const categoria = await Banco.session('select c.id_categoria, c.descricao from Vendi.categoria c')
    if(categoria.rows[0]){
    return categoria.rows
    }
    const erro = Funcoes.padraoErro("não foi encontrado resultados na base de dados")
    return erro
  }

  async function perfil(token) {
    const user     = await verificaUser(token)
    if(user.status== false){
      const erro = Funcoes.padraoErro("não foi possivel identificar o usuario da requisição")
      return erro
    }else{
      const pessoa = await Banco.session(`select u.nome, u.linkfoto from Vendi.user u where u.id_user = ${user}`)
      if(pessoa.rows[0]){
        var json = new Object()
        json.nome=pessoa.rows[0].nome
        json.foto= pessoa.rows[0].linkfoto
        return json
      }
      const erro = Funcoes.padraoErro("não foi encontrado resultados na base de dados")
      return erro
    }
  }
  async function anuncio(categoria,pagina,latitude,longitude) {
    var dados = Object()
    dados.latitude=latitude[0]+latitude[1]+latitude[2]+latitude[3]+latitude[4]
    dados.longitude=longitude[0]+longitude[1]+longitude[2]+longitude[3]+longitude[4]
      const anuncio = await Banco.session(`select a.id_anuncio,(select m.municipio as cidade from vendi.coodmunicipio m  where m.latitude like '${dados.latitude}%' and longitude like '${dados.longitude}%' order by id_coodmunicipio desc),u.nome as vendedor, a.id_categoria, a.titulo, a.descricao, cast( a.valor as numeric) as valor, a.dataanuncio, a.classificacao, f.linkfoto from Vendi.anuncio a left outer join Vendi.vendedor v on v.id_vendedor= a.id_vendedor left outer join Vendi.pessoa p on p.id_pessoa= v.id_pessoa left outer join Vendi.endereco e on e.id_pessoa = v.id_pessoa left outer join Vendi.user   u   on u.id_user = p.id_user left outer join Vendi.foto f on f.id_anuncio = a.id_anuncio where a.id_categoria = ${categoria} and a.latitude like '${dados.latitude}%' and a.longitude like '${dados.longitude}%' order by a.classificacao desc LIMIT 10 OFFSET(${pagina} - 1) * 10`)

      if(anuncio.rows[0]){
          return anuncio.rows
        }
        const erro = Funcoes.padraoErro("não foi encontrado resultados na base de dados")
        return erro
    
  }
    async function anuncioLista(idAnuncio, latitude, longitude) {
      
      const anuncio = await Banco.session(`select a.id_anuncio, u.nome as vendedor, e.cidade, a.id_categoria, a.titulo, a.descricao, a.valor, a.dataanuncio, f.linkfoto, a.latitude, a.longitude from Vendi.anuncio a left outer join Vendi.vendedor v on v.id_vendedor= a.id_vendedor left outer join Vendi.pessoa p on p.id_pessoa= v.id_pessoa left outer join Vendi.endereco e on e.id_pessoa = v.id_pessoa left outer join Vendi.user   u   on u.id_user = p.id_user left outer join Vendi.foto f on f.id_anuncio = a.id_anuncio where a.id_anuncio = ${idAnuncio}`)
      if(anuncio.rows[0]){
        var resultAnuncio = Object()
        resultAnuncio.idAnuncio= anuncio.rows[0].id_anuncio,
        resultAnuncio.vendedor= anuncio.rows[0].vendedor,
        resultAnuncio.cidade= anuncio.rows[0].cidade,
        resultAnuncio.idCategoria= anuncio.rows[0].id_categoria,
        resultAnuncio.titulo= anuncio.rows[0].titulo
        resultAnuncio.descricao= anuncio.rows[0].descricao
        resultAnuncio.valor= parseFloat(anuncio.rows[0].valor)
        resultAnuncio.dataAnuncio= anuncio.rows[0].dataanuncio,
        resultAnuncio.linkfoto = anuncio.rows[0].linkfoto
        resultAnuncio.distancia = Funcoes.distanciaLatLong(latitude, longitude, anuncio.rows[0].latitude,anuncio.rows[0].longitude)

          return [resultAnuncio]
        }
        const erro = Funcoes.padraoErro("não foi encontrado resultados na base de dados")
        return erro
    
  }
  async function selectTable(tabela,campo,campoBusca, valorbusca) {
     const result = await Banco.session(`select s.${campo} from Vendi.${tabela} s WHERE ${campoBusca}='${valorbusca}';`)
     if(result.rows[0]){
      return result.rows[0]
    }
    const erro = Funcoes.padraoErro("não foi encontrado resultados na base de dados")
    return erro
  }

  async function verificaVendedor(token) {
    const user     = await verificaUser(token)
    if(user.status== false){
      const erro = Funcoes.padraoErro("não foi possivel identificar o usuario da requisição")
      return erro
    }else{
      const vendedor = await Banco.session(`select id_vendedor from Vendi.user  left outer join Vendi.pessoa    on pessoa.id_user=   Vendi.user.id_user left outer join Vendi.vendedor  on vendedor.id_pessoa= pessoa.id_pessoa where Vendi.user.id_user=${user}`)
      if(vendedor.rows[0]){
          return vendedor.rows[0]
      }
      const erro = Funcoes.padraoErro("não foi encontrado resultados na base de dados")
      return erro
    }
}
async function validaVendedor(token) {
  const idVendedor = Funcoes.verificajwt(token)
  var erro
  var token
  var vendedor

  if(idVendedor== false){
    erro = Funcoes.padraoErro("não foi possivel identificar o usuario da requisição")
    return erro
  }else{
  var result = await Banco.session(`select * from Vendi.vendedor where id_vendedor=${idVendedor}`)
  if(result.rows[0]){
    token = Funcoes.atualizajwt(token)
    vendedor = result.rows[0]
    return ({token,vendedor})
    }else{
      erro = Funcoes.padraoErro("não foi encontrado nenhum vendedor.")
      return erro
    }
  }
}

async function fotoAnuncio(linkFoto) {
  const anuncio = await Banco.session(`select f.linkfoto from Vendi.foto f where f.linkFoto = '${linkFoto}'`)
  if(anuncio.rows[0]){
    return anuncio.rows[0].linkfoto
  }
  const erro = Funcoes.padraoErro("não foi encontrado resultados na base de dados")
  return erro
}

async function anuncioNegocicao(idAnuncio) {
  var anuncio = await Banco.session(`select a.titulo, t.telefone from Vendi.anuncio a left outer join Vendi.vendedor v on v.id_vendedor = a.id_vendedor left outer join Vendi.telefone t on t.id_pessoa = v.id_pessoa where a.id_anuncio = ${idAnuncio} and t.whatsapp = 'true'`)
  if(anuncio.rows[0]){
    var anuncios = Object()
    anuncios.descricao = "O%20item%20"+anuncio.rows[0].titulo.replace(' ', '%20')+ "%20ainda%20está%20a%20venda%20?"
    anuncios.telefone = anuncio.rows[0].telefone
    return anuncios
  }
  const erro = Funcoes.padraoErro("não foi encontrado resultados na base de dados")
  return erro
}


   
  


module.exports = {analizaLatitude,vendedor,cliente, pessoacpf, categoria,  perfil, anuncio, anuncioLista, selectTable, verificaUser, verificaVendedor, validaVendedor, fotoAnuncio, anuncioNegocicao}