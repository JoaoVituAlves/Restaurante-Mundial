import express from 'express';
import rotaDialogFlow from './rotas/rotaDialogFlow.js';

const host = '0.0.0.0';
const porta = 3500;

const app = express();
app.use(express.json());
app.use('/dialogflow', rotaDialogFlow);
//disponibilizando acesso ao arquivo index.html
app.use(express.static('./publico'));

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})

