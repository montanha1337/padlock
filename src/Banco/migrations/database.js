import Banco from '../connect'
import DadosIbge from './dadosibge'

async function inserirCampo(tabela,campo,tipocampo){
  tabela = 'vendi.'+tabela
  await Banco.session(`ALTER TABLE ${tabela} ADD COLUMN  ${campo} ${tipocampo};`)
  return true
}

async function verificaColuna(tabela, coluna,tipocampo){
  const coluna1 = await Banco.session(`SELECT EXISTS( SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tabela}' AND  COLUMN_NAME = '${coluna}');`)
  if(coluna1.rows[0].exists == false){
      console.log("-----------------------------campo não existe no banco de dados")
      await inserirCampo(tabela,coluna,tipocampo)
      return true
    }else{
   return true
  }
}

async function verificaTabela(tabela){
  const tabela1 = await Banco.session(`SELECT EXISTS ( SELECT FROM information_schema.tables WHERE  table_schema = 'vendi' AND    table_name   = '${tabela}');`)
  
  if(tabela1.rows[0].exists == false){
    switch(tabela){
      case 'conexao':
        await conexao()
        return true

      case 'anuncio':
        await anuncio()
        return true

      case 'endereco':
        await endereco()
        return true

      case 'entrega':
        await entrega()
        return true

      case 'formadepagamento':
        await formadepagamento()
        return true

      case 'foto':
        await foto()
        return true

      case 'negociacao':
        await negociacao()
        return true

      case 'pessoa':
        await pessoa()
        return true

      case 'telefone':
        await telefone()
        return true

      case 'user':
        await user()
        return true

      case 'vendedor':
        await vendedor()
        return true

      case 'categoria':
        await categoria()
        return true

      case 'coodmunicipio':
        await ibge()
        return true
    }
  }else{
    switch(tabela){
      case 'conexao':
        await verificaColuna(tabela, 'id_conexao','integer')
        await verificaColuna(tabela, 'descricao','varchar(200)')
        return true

      case 'anuncio':
        await verificaColuna(tabela, 'id_anuncio','integer')
        await verificaColuna(tabela, 'id_categoria','integer')
        await verificaColuna(tabela, 'id_vendedor','integer')
        await verificaColuna(tabela, 'titulo','varchar(150)')
        await verificaColuna(tabela, 'descricao','varchar(500)')
        await verificaColuna(tabela, 'valor','float')
        await verificaColuna(tabela, 'dataanuncio','varchar(10)')
        await verificaColuna(tabela, 'classificacao','integer')
        await verificaColuna(tabela, 'latitude','varchar(35)')
        await verificaColuna(tabela, 'longitude','varchar(200)')
        
        return true

      case 'endereco':
        await verificaColuna(tabela, 'id_endereco','integer')
        await verificaColuna(tabela, 'id_pessoa','integer')
        await verificaColuna(tabela, 'numero','integer')
        await verificaColuna(tabela, 'rua','varchar(50)')
        await verificaColuna(tabela, 'bairro','varchar(50)')
        await verificaColuna(tabela, 'cidade','varchar(50)')
        return true

      case 'entrega':
        await verificaColuna(tabela, 'id_entrega','integer')
        await verificaColuna(tabela, 'id_vendedor','integer')
        await verificaColuna(tabela, 'id_endereco','integer')
        await verificaColuna(tabela, 'tipoentrega','integer')
        await verificaColuna(tabela, 'dataconfirmacaoentrega','date')
        await verificaColuna(tabela, 'codigorastreio','varchar(50)')
        return true

      case 'formadepagamento':
        await verificaColuna(tabela, 'id_formadepagamento','integer')
        await verificaColuna(tabela, 'descricao','varchar(20)')
        return true

      case 'foto':
        await verificaColuna(tabela, 'id_foto','integer')
        await verificaColuna(tabela, 'linkfoto','varchar(500)')
        await verificaColuna(tabela, 'id_anuncio','integer')
        return true

      case 'negociacao':
        await verificaColuna(tabela, 'id_negociacao','integer')
        await verificaColuna(tabela, 'id_entrega','integer')
        await verificaColuna(tabela, 'id_anuncio','integer')
        await verificaColuna(tabela, 'id_pessoa','integer')
        await verificaColuna(tabela, 'id_pagamento','integer')
        await verificaColuna(tabela, 'valor','float')
        await verificaColuna(tabela, 'datanegociacao','date')
        return true

      case 'pessoa':
        await verificaColuna(tabela, 'id_pessoa','integer')
        await verificaColuna(tabela, 'id_user','integer')
        await verificaColuna(tabela, 'cpf','varchar(11)')
        return true

      case 'telefone':
        await verificaColuna(tabela, 'id_telefone','integer')
        await verificaColuna(tabela, 'id_pessoa','integer')
        await verificaColuna(tabela, 'telefone','varchar(20)')
        await verificaColuna(tabela, 'whatsapp','boolean')
        return true

      case 'user':
        await verificaColuna(tabela, 'id_user','integer')
        await verificaColuna(tabela, 'nome','varchar(35)')
        await verificaColuna(tabela, 'email','varchar(35)')
        await verificaColuna(tabela, 'senha','varchar(200)')
        return true

      case 'vendedor':
        await verificaColuna(tabela, 'id_vendedor','integer')
        await verificaColuna(tabela, 'id_pessoa','integer')
        await verificaColuna(tabela, 'classificacao','integer')
        return true

      case 'categoria':
        await verificaColuna(tabela, 'id_categoria','integer')
        await verificaColuna(tabela, 'descricao','varchar(35)')
        return true

        case 'coodmunicipio':
        await verificaColuna(tabela, 'id_coodmunicipio','integer')
        await verificaColuna(tabela, 'codigoibge','integer')
        await verificaColuna(tabela, 'latitude','varchar(35)')
        await verificaColuna(tabela, 'longitude','varchar(200)')
        await verificaColuna(tabela, 'estado','varchar(2)')
        await verificaColuna(tabela, 'municipio','varchar(100)')
        return true
    }
  }
}
async function vendi(){
  await Banco.session("CREATE SCHEMA Vendi;",)
    return true

}
//Função com Script Para criar usuário
//Campos:id_user,nome,email,senha
async function user(){
  await Banco.session("CREATE TABLE Vendi.user (id_user SERIAL CONSTRAINT pk_id_user PRIMARY KEY,nome varchar(35) NOT NULL, email varchar(35) UNIQUE NOT NULL,senha varchar(200) NOT NULL, linkfoto varchar(200));",)
  const user= Banco.session('select * from Vendi.user')
  if(user){
    return user
  }
}
//Função Com Script para criar a tabela conexão onde é armazenada as mensagens do backend
//Campos:id_conexao,descricao
async function conexao(){
  await Banco.session("CREATE SCHEMA Vendi; CREATE TABLE Vendi.conexao (id_conexao SERIAL CONSTRAINT pk_id_conexao PRIMARY KEY,descricao varchar(35) UNIQUE NOT NULL);INSERT INTO Vendi.conexao(descricao)VALUES ('Conexao realizada');INSERT INTO Vendi.conexao(descricao)VALUES ('Atualizacao feita com sucesso.');INSERT INTO Vendi.conexao(descricao)VALUES ('Banco apagado com sucesso.');INSERT INTO Vendi.conexao(descricao)VALUES ('Conseguiu acessar via email!!! :)');",)
    const conexao= await Banco.session("select descricao from Vendi.conexao con where con.descricao= 'Atualizacao feita com sucesso.'")
    if(conexao){
      return conexao
    }
}
//Função Com Script para criar a tabela pessoa
//Campos:id_pessoa,id_user,cpf
async function pessoa(){
  await Banco.session("CREATE TABLE Vendi.pessoa (id_pessoa SERIAL CONSTRAINT pk_id_pessoa PRIMARY KEY,id_user integer REFERENCES vendi.user (id_user), cpf varchar(15) UNIQUE NOT NULL);")
  const pessoa= Banco.session('select * from Vendi.pessoa')
  if(pessoa){
    return pessoa
  }
}
//Função Com Script para criar a tabela telefone
//Campos:id_vendedor,id_pessoa,calssificacao
async function telefone(){
  await Banco.session("CREATE TABLE Vendi.telefone (id_telefone SERIAL CONSTRAINT pk_id_telefone PRIMARY KEY,id_pessoa integer REFERENCES vendi.pessoa (id_pessoa),telefone varchar(20) not null, whatsapp boolean NOT NULL);")
    const telefone= Banco.session('select * from Vendi.telefone')
    if(telefone){
      return telefone
    }
}
//Função Com Script para criar a tabela endereco
//Campos:id_vendedor,id_pessoa,calssificacao
async function endereco(){
  await Banco.session("CREATE TABLE Vendi.endereco (id_endereco SERIAL CONSTRAINT pk_id_endereco PRIMARY KEY,id_pessoa integer REFERENCES vendi.pessoa (id_pessoa), rua varchar(50) NOT NULL, bairro varchar(50) NOT NULL, cidade varchar(50) NOT NULL, cep varchar(8) NOT NULL, numero integer NOT NULL);")
    const endereco= Banco.session('select * from Vendi.endereco')
    if(endereco){
      return endereco
    }
}
//Função Com Script para criar a tabela Vendedor
//Campos:id_vendedor,id_pessoa,calssificacao
async function vendedor(){
  await Banco.session("CREATE TABLE Vendi.vendedor (id_vendedor SERIAL CONSTRAINT pk_id_vendedor PRIMARY KEY,id_pessoa integer REFERENCES vendi.pessoa (id_pessoa), classificacao integer NOT NULL);")
    const vendedor= Banco.session('select * from Vendi.vendedor')
    if(vendedor){
      return vendedor
    }
}
//Função Com Script para criar a tabela categoria
//Campos:id_categoria, cescricao
async function categoria(){
  await Banco.session("CREATE TABLE Vendi.categoria (id_categoria SERIAL CONSTRAINT pk_id_categoria PRIMARY KEY, descricao varchar(50) NOT NULL);INSERT INTO vendi.categoria(descricao)VALUES ('Geral'); INSERT INTO vendi.categoria(descricao)VALUES ('Automoveis'); INSERT INTO vendi.categoria(descricao)VALUES ('Servicos');")
  const categoria= Banco.session('select * from Vendi.categoria')
  if(categoria){
    return categoria
  }
}
//Função Com Script para criar a tabela anuncio
//Campos:
async function anuncio(){
  await Banco.session("CREATE TABLE Vendi.anuncio (id_anuncio SERIAL CONSTRAINT pk_id_anuncio PRIMARY KEY,id_vendedor integer REFERENCES vendi.vendedor (id_vendedor),id_categoria integer REFERENCES vendi.categoria (id_categoria),titulo varchar(150) not null, descricao varchar(500) not null, valor numeric not null, dataAnuncio date not null,classificacao integer,localizacao varchar(500) not null);")
  const anuncio= Banco.session('select * from Vendi.anuncio')
  if(anuncio){
    return anuncio
  }
}
async function foto(){
  await Banco.session("CREATE TABLE Vendi.foto (id_foto SERIAL CONSTRAINT pk_id_foto PRIMARY KEY,id_anuncio integer REFERENCES vendi.anuncio(id_anuncio),linkfoto varchar(200)not null);")
  const foto= Banco.session('select * from Vendi.foto')
  if(foto){
    return foto
  }
}
async function entrega(){
  await Banco.session("CREATE TABLE Vendi.entrega (id_entrega SERIAL CONSTRAINT pk_id_entrega PRIMARY KEY,id_vendedor integer REFERENCES vendi.vendedor (id_vendedor),id_endereco integer REFERENCES vendi.endereco (id_endereco),codigoRastreio varchar(50) not null, tipoEntrega integer not null, dataConfirmacaoEntrega date not null)")
  const entrega= Banco.session('select * from Vendi.entrega')
  if(entrega){
    return entrega
  }
}
async function formadepagamento(){
  await Banco.session("CREATE TABLE Vendi.formadepagamento (id_formadepagamento SERIAL CONSTRAINT pk_id_formadepagamento PRIMARY KEY, descricao varchar(50) NOT NULL);")
  const formadepagamento= Banco.session('select * from Vendi.formadepagamento')
  if(formadepagamento){
    return formadepagamento
  }
}
async function negociacao(){
  await Banco.session("CREATE TABLE Vendi.negociacao (id_negociacao SERIAL CONSTRAINT pk_id_negociacao PRIMARY KEY,id_pessoa integer REFERENCES vendi.pessoa (id_pessoa),id_anuncio integer REFERENCES vendi.anuncio (id_anuncio),id_entrega integer REFERENCES vendi.entrega (id_entrega),id_pagamento integer REFERENCES vendi.formadepagamento (id_formadepagamento), valor float not null, datanegociacao date not null);")
  const negociacao= Banco.session('select * from Vendi.negociacao')
  if(negociacao){
    return negociacao
  }
}
async function userTeste(password) {
  await Banco.session(`INSERT INTO Vendi.user(email, senha, nome)VALUES ('teste@teste.com',${password},'Desenvolvedor');`)
  return true
}

async function ibge(){
  await Banco.session("CREATE TABLE Vendi.coodmunicipio (id_coodmunicipio SERIAL CONSTRAINT pk_id_coodmunicipio PRIMARY KEY,codigoibge integer  UNIQUE NOT NULL, latitude varchar(35),longitude varchar(200), estado varchar(2), municipio varchar(100))",)
  const ibge= await verificaTabela('coodmunicipio')
  if(ibge==true){
    await atualizaDadosIBGE()
    return ibge
  }
}

async function atualizaDadosIBGE(){
  const dados= await verificaTabela('coodmunicipio')
  if(dados== true){
    const arquivo = await DadosIbge.dadosIbge()
    if(arquivo == true){
      return true
    }
  }
}

//Função Com Script para Deletar O Schema do banco de dados
  async function deletaschema(){
    await Banco.session("SELECT count(nspname) FROM pg_catalog.pg_namespace;")

    if(result.rows[0].count==7){    
      await Banco.session("DROP SCHEMA Vendi CASCADE;") 
      return true
    }
    else{
      return false
    }  
  }






module.exports = {verificaTabela, vendi, user, userTeste, conexao, deletaschema, pessoa, vendedor, categoria, anuncio, foto, telefone, endereco, entrega, formadepagamento, negociacao, ibge}