import Banco from '../connect'
import Funcoes from '../../controller/functions'
import Consulta from './consulta'

async function vendedor(token) {
    const user     = await Consulta.verificaUser(token)
    if(user.status== false){
      return user
    }else{
        var vendedor = await Consulta.vendedor(token)
        if(vendedor.status== false){
            return vendedor
        }else{
            if(vendedor.id_vendedor== null){
                const erro = Funcoes.padraoErro("Vendedor não encontrado")
                return erro
            }else{
                const pessoa = await Banco.session(`select id_pessoa from Vendi.vendedor where id_vendedor = ${vendedor.id_vendedor}`)
                vendedor.id_pessoa = pessoa.rows[0].id_pessoa
                var n = await Banco.session(`select count(f.id_anuncio) as vx from Vendi.anuncio a left outer join Vendi.foto f on f.id_anuncio = a.id_anuncio where a.id_vendedor = ${vendedor.id_vendedor}`)
                var anuncio = await Banco.session(`select linkfoto, a.id_anuncio, f.id_foto from Vendi.anuncio a left outer join Vendi.foto f on f.id_anuncio = a.id_anuncio where a.id_vendedor = ${vendedor.id_vendedor}`)
                for (var i = 0; i < n.rows[0].vx; i++) {
                    await Banco.session(`select id_pessoa from Vendi.vendedor where id_vendedor = ${vendedor.id_vendedor}`) 
                    await Banco.session(`select linkfoto from Vendi.anuncio a left outer join Vendi.foto f on f.id_anuncio = a.id_anuncio where f.id_foto = ${anuncio.rows[i].id_foto}`)
                    await Banco.session(`delete from Vendi.foto where id_anuncio = ${anuncio.rows[i].id_anuncio}`)
                }
                await Banco.session(`delete from Vendi.anuncio where id_vendedor = ${vendedor.id_vendedor}`)
                await Banco.session(`delete from Vendi.vendedor where id_vendedor = ${vendedor.id_vendedor}`)
                await Banco.session(`delete from Vendi.endereco where id_pessoa = ${vendedor.id_pessoa}`)
                await Banco.session(`delete from Vendi.telefone where id_pessoa = ${vendedor.id_pessoa}`)
                await Banco.session(`delete from Vendi.pessoa where id_pessoa = ${vendedor.id_pessoa}`)
                vendedor.status = 'Deletado'
                return vendedor
            }
        }
    }
}
async function cliente(token) {
    const user     = await Consulta.verificaUser(token)
    if(user.status== false){
      return user
    }else{
        var cliente = await Consulta.cliente(token)
        if(cliente.status== false){
            return cliente
        }else{
            if(cliente.id_pessoa== null){
                const erro = Funcoes.padraoErro("Cliente não existe!!!")
                return erro
            }else{
                await Banco.session(`delete from Vendi.endereco where id_pessoa = ${cliente.id_pessoa}`)
                await Banco.session(`delete from Vendi.telefone where id_pessoa = ${cliente.id_pessoa}`)
                await Banco.session(`delete from Vendi.pessoa where id_pessoa = ${cliente.id_pessoa}`)
                cliente.status = 'Deletado'
                return cliente
            }
        }
    }
}

async function user(token) {
    const user     = await Consulta.verificaUser(token)
    if(user.status== false){
      return user
    }else{

    }
}
async function anuncio(id,token) {
  const vendedor = await Consulta.validaVendedor(token)
  if(vendedor.status== false){
    const erro = Funcoes.padraoErro("não foi possivel identificar o usuario da requisição")
    return erro
  }else{
  var foto = await Banco.session(`select linkfoto from Vendi.foto where id_anuncio =${id}`)
  var anuncio = await Banco.session(`delete from Vendi.foto where id_anuncio = ${id}`)
  anuncio = await Banco.session(`delete from Vendi.anuncio where id_anuncio = ${id}`)
  return true
  }
}


module.exports = { vendedor, user, cliente, anuncio}