import { obterCardPizzas } from "../funcoesDialogFlow/funcoesDLFlow.js";

export default class DialogFlowCtrl {

    processarIntencoes(requisicao, resposta) {
        //verificar se a inteção é 'Default Welcome Intent'
        if (requisicao.method === 'POST') {
            const intencao = requisicao.body.queryResult.intent.displayName;

            //como identificar a origem da requisição do dialogFlow: messenger, slack, etc
            const origem = requisicao.body?.originalDetectIntentRequest?.source;
            if (intencao === 'Default Welcome Intent') {
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
            }

        }
    }
}