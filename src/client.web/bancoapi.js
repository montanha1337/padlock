import  Axios from "axios";

const article = { title: 'Conexao banco' };
const headers = { 
    'Authorization': 'Bearer my-token',
    'My-Custom-Header': 'foobar'
};

//https://brasilapi.com.br/api/banks/v1
async function buscarBancos(){
    let response
    response = await Axios.get('https://brasilapi.com.br/api/banks/v1', article, { headers })
    return response.data
}

module.exports = {buscarBancos}