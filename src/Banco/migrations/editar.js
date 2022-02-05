import Banco from '../connect'
import Funcoes from '../../controller/functions'
import Consulta from './consulta'


async function updateTable(tabela,campoUpdate,valorUpdate,campoBusca, valorBusca) {
    const result = await Banco.session(`UPDATE Vendi.${tabela} SET ${campoUpdate}='${valorUpdate}' WHERE ${campoBusca}='${valorBusca}';`)
    return true
  }
  async function atualizaCliente(tabela,campo,dado,dadoPesquisa) {
      var result = await Banco.session(`select ${campo} from Vendi.user  left outer join Vendi.pessoa    on pessoa.id_user=   Vendi.user.id_user left outer join Vendi.telefone  on telefone.id_pessoa= pessoa.id_pessoa left outer join Vendi.endereco  on endereco.id_pessoa= pessoa.id_pessoa where ${campo}='${dado}' `)
      if(result.rows[0]){
        return true
      }else{
        result = await updateTable(tabela,campo,dado,campo,dadoPesquisa)
        if(result== true){
          result = await Consulta.selectTable(tabela,campo,campo, dado)
          return result
        }else{
          console.log(`erro ao realizar o update da tabela ${tabela}, por favor verifique.`)
          return Funcoes.padraoErro(`erro ao realizar o update da tabela ${tabela}, por favor verifique.`)
        }
      }
    
  }
  async function atualizaVendedor(tabela,campo,dado,dadoPesquisa) {
    if(campo =='cpf'){
      const verifica = await Funcoes.validacpf(dado)
      if(verifica == false){
        const erro = Funcoes.padraoErro("não será possivel alterar o CPF, pois está inválido")
        console.log(erro.mensagem)
        return erro
      }
    }else{
      var result = await Banco.session(`select ${campo} from Vendi.user  left outer join Vendi.pessoa    on pessoa.id_user=   Vendi.user.id_user left outer join Vendi.telefone  on telefone.id_pessoa= pessoa.id_pessoa left outer join Vendi.endereco  on endereco.id_pessoa= pessoa.id_pessoa left outer join Vendi.vendedor  on vendedor.id_pessoa= pessoa.id_pessoa where ${campo}='${dado}' `)
    if(result.rows[0]){
      return true
    }else{
      
      result = await updateTable(tabela,campo,dado,campo,dadoPesquisa)
      
      if(result== true){
        result = await Consulta.selectTable(tabela,campo,campo, dado)
        return result
      }else{
        return Funcoes.padraoErro(`erro ao realizar o update da tabela ${tabela}, por favor verifique.`)
      }
    }
    }
  
}

async function mediaClassificacao(vendedor,classificacao) {
  var mediaBanco
    var result = await Banco.session(`select classificacao from Vendi.vendedor v where v.id_vendedor= ${vendedor}`)
    if(result.rows[0]){
      mediaBanco= parseFloat(result.rows[0].classificacao)
      classificacao = parseFloat(classificacao)
      classificacao= (mediaBanco + classificacao) / 2
      await Banco.session(`update Vendi.vendedor set classificacao = ${classificacao} where id_vendedor=${vendedor}`)
      classificacao = await Banco.session(`select classificacao from Vendi.vendedor where id_vendedor=${vendedor}`)
      return classificacao.rows[0].classificacao
    }
    const erro = Funcoes.padraoErro("Nao foi possivel realizar classificar o vendedor")
    return erro
  }

  async function mediaClassificacaoAnuncio(anuncio,classificacao) {
    var mediaBanco
      var result = await Banco.session(`select classificacao from Vendi.anuncio a where a.id_anuncio= ${anuncio}`)
      if(result.rows[0]){
        mediaBanco= parseFloat(result.rows[0].classificacao)
        classificacao = parseFloat(classificacao)
        classificacao= (mediaBanco + classificacao) / 2
        await Banco.session(`update Vendi.anuncio set classificacao = ${classificacao} where id_anuncio=${anuncio}`)
        classificacao = await Banco.session(`select classificacao from Vendi.anuncio where id_vendedor=${anuncio}`)
        return classificacao.rows[0].classificacao
      }
      const erro = Funcoes.padraoErro("Nao foi possivel realizar classificar o anuncio")
      return erro
    }



  module.exports = { updateTable, atualizaCliente, atualizaVendedor,mediaClassificacao, mediaClassificacaoAnuncio}