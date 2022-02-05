import app from './app';
const PORT = process.env.PORT || 8080;
//para ativar o backend coloque yarn dev
app.listen(PORT);
console.log(`Backend online !!!\nAberto na porta ${ PORT }`)
