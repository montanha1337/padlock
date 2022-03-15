import app from './app';
const PORT = process.env.PORT || 8080;
//para ativar o backend coloque yarn dev
app.listen(PORT);
if (PORT == 8080) {
    console.log("Backend online !!!\n Acesse: http://localhost:8080/web")
} else {
    console.log(`Backend online !!!`)
}
