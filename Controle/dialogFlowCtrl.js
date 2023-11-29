import { obterCardPizzas } from "../funcoesDialogFlow/funcoesDLFlow.js";
import Pedido from '../Modelo/pedido.js';
import Pizza from "../Modelo/pizza.js";

export default class DialogFlowCtrl {

    processarIntencoes(requisicao, resposta) {
        //verificar se a inteção é 'Default Welcome Intent'
        if (requisicao.method === 'POST') {
            const intencao = requisicao.body.queryResult.intent.displayName;

            //como identificar a origem da requisição do dialogFlow: messenger, slack, etc
            const origem = requisicao.body?.originalDetectIntentRequest?.source;
            if (intencao === 'IntencaoUsuario') {
                //devolver uma resposta para o DialogFlow
                if (origem) {
                    //cards no formato custom
                    obterCardPizzas('custom').then((listaCards) => {
                        let respostaDF = {
                            "fulfillmentMessages": []
                        }
                        respostaDF.fulfillmentMessages.push({
                            "text": {
                                "text": [
                                    "Bem vindo a Pizzaria Don Marino! \n",
                                    "Esses são nossos deliciosos sabores de pizza: \n"
                                ]
                            }
                        });
                        respostaDF.fulfillmentMessages.push(...listaCards);
                        respostaDF.fulfillmentMessages.push({
                            "text": {
                                "text": [
                                    "Qual pizza você deseja?"
                                ]
                            }
                        })
                        resposta.json(respostaDF);
                    }).catch((erro) => {
                        let respostaDF = {
                            "fulfillmentMessages": [{
                                "text": {
                                    "text": [
                                        "Erro ao recuperar o cardápio: \n",
                                        "Não foi possível consultar o menu de pizzas!",
                                        "Desculpe pelo transtorno!"
                                    ]
                                }
                            }]
                        }
                        resposta.json(respostaDF);
                    })

                }
                else {
                    obterCardPizzas('messenger').then((listaCards) => {
                        let respostaDF = {
                            "fulfillmentMessages": []
                        }
                        respostaDF.fulfillmentMessages.push({
                            "payload": {
                                "richContent": [[{
                                    "type": "description",
                                    "title": "Bem vindo a Pizzaria Don Marino!",
                                    "text": [
                                        "Estamos muito felizes em ter você por aqui!",
                                        "Esses são nossos deliciosos sabores de pizza: \n"
                                    ]
                                }]]
                            }
                        });
                        respostaDF.fulfillmentMessages[0].payload.richContent[0].push(...listaCards);
                        respostaDF.fulfillmentMessages[0].payload.richContent[0].push({
                            "type": "description",
                            "title": "Qual pizza você deseja?",
                            "text": []
                        });
                        resposta.json(respostaDF);
                    }).catch((erro) => {
                        let respostaDF = {
                            "fulfillmentMessages": []
                        }
                        respostaDF.fulfillmentMessages.push({
                            "payload": {
                                "richContent": [[{
                                    "type": "description",
                                    "title": "Erro ao recuperar o cardápio: \n",
                                    "text": [
                                        "Não foi possível consultar o menu de pizzas!",
                                        "Desculpe pelo transtorno!"
                                    ]
                                }]]
                            }
                        });

                    })
                }
            } // fim if (intecao == 'IntencaoUsuario')
            else if (intencao === "RegistroLocalEntrega") {
                //capturar a escolha do usuário em queryResult.outputContexts = [ lista de objetos que representam contextos]
                //Em um desses objetivos será possível acessar a propriedade "parameters"
                //Dentro do objeto parameters poderemos acessar os atributos pizza : [] e number :[]
                let pizzas = [];
                let qtds = [];
                for (const contexto of requisicao.body.queryResult.outputContexts) {
                    if (contexto.parameters.pizza) {
                        pizzas = contexto.parameters.pizza;
                        qtds = contexto.parameters.number;
                    }
                }

                const dataHoje = new Date().toLocaleDateString(); //"01/01/2023"
                let itensPedido = [];
                for (let i = 0; i < pizzas.length; i++) {

                    itensPedido.push({
                        "codigo":0,
                        "pizza": pizzas[i],
                        "qtd": qtds[i]
                    });

                }
                const enderecoEntrega = `Rua: ${requisicao.body.queryResult.parameters.location['street-address']} \n
                Cidade: ${requisicao.body.queryResult.parameters.location.city} / 
                ${requisicao.body.queryResult.parameters.location["admin-area"]} \n
                `;
                const pedido = new Pedido(0, dataHoje, itensPedido);
                pedido.gravar().then(() => {
                    if (origem) { //mensagem para ambientes custom
                        let respostaDF = {
                            "fulfillmentMessages": [{
                                "text": {
                                    "text": [
                                        `Pedido nº ${pedido.id} foi registrado com sucesso! \n`,
                                        `Em aproximadamente 35 minutos seu pedido será entregue no seguinte endereço: ${enderecoEntrega} `,
                                        `Obrigado pela preferência!`,
                                        `Agradecemos o seu contato!`
                                    ]
                                }
                            }]
                        }
                        resposta.json(respostaDF);
                    }
                    else { //messenger
                        let respostaDF = {
                            "fulfillmentMessages": []
                        }
                        respostaDF.fulfillmentMessages.push({
                            "payload": {
                                "richContent": [[{
                                    "type": "description",
                                    "title": `Pedido nº ${pedido.id} foi registrado com sucesso! \n`,
                                    "text": [
                                        `Em aproximadamente 35 minutos seu pedido será entregue no seguinte endereço: ${enderecoEntrega} `,
                                        `Obrigado pela preferência!`,
                                        `Agradecemos o seu contato!`
                                    ]
                                }]]
                            }
                        });
                        resposta.json(respostaDF);
                    }
                })
                    .catch((erro) => {
                        if (origem) { //mensagem para ambientes custom
                            let respostaDF = {
                                "fulfillmentMessages": [{
                                    "text": {
                                        "text": [
                                            `Erro ao registrar o seu pedido! \n`,
                                            `Erro: ${erro.message}`,
                                            `Entre em contato pelo telefone (11) 99999-9999`,
                                            `Agradecemos o seu contato!`
                                        ]
                                    }
                                }]
                            }
                            resposta.json(respostaDF);
                        }
                        else { //messenger
                            let respostaDF = {
                                "fulfillmentMessages": []
                            }
                            respostaDF.fulfillmentMessages.push({
                                "payload": {
                                    "richContent": [[{
                                        "type": "description",
                                        "title": `Erro ao registrar o seu pedido! \n`,
                                        "text": [
                                            `Erro: ${erro.message}`,
                                            `Entre em contato pelo telefone (11) 99999-9999`,
                                            `Agradecemos o seu contato!`
                                        ]
                                    }]]
                                }
                            });
                        }
                    });
            }
        }
    }
}