import  Axios from "axios";
//https://brasilapi.com.br/api/banks/v1
async function buscarBancos(){
    let response
    const article = { title: 'Axios POST Request Example' };
    const headers = { 
        'Authorization': 'Bearer my-token',
        'My-Custom-Header': 'foobar'
    };
    response = await Axios.get('https://brasilapi.com.br/api/banks/v1', article, { headers })
    return response.data
}



module.exports = {buscarBancos}