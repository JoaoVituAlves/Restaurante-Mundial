//url de referência https://cloud.google.com/dialogflow/es/docs/integrations/dialogflow-messenger?hl=pt-br

import Pizza from "../Modelo/pizza.js";

export function criarMessengerCard(){
    return {
        type:"info",
        title:"",
        subtitle:"",
        image: {
            src : {
                rawUrl:""
            }
        },
        actionLink:""
    }
} //fim da função criarMessengerCard

export function criarCustomCard(){
    //exibir nos ambientes padrões, tais como: ambiente de teste do DialogFlow, slack, etc
    return {
        card: {
            title:"",
            subtitle:"",
            imageUri:"",
            buttons: [
                {
                    text:"botão",
                    postback:""
                }
            ]
        }
    }
    
} // fim da função criarCustomCard

export async function obterCardPizzas(tipoCard = 'custom'){
    const pizzaModelo = new Pizza();
    const listaPizzas = await pizzaModelo.consultar();
    const listaCards = [];
    for (const pizza of listaPizzas){
        let cartao;
        if (tipoCard == 'custom'){
            cartao = criarCustomCard();
            cartao.card.title = pizza.descricao;
            cartao.card.subtitle = `tamanho: ${pizza.tamanho}, 
                                    borda: ${pizza.borda}, 
                                    valor: R$${pizza.valor},
                                    ingredientes: ${pizza.ingredientes}`;
            cartao.card.imageUri = pizza.urlImagem;
            cartao.card.buttons[0].text = "Clique aqui para mais informações";
            cartao.card.buttons[0].postback = "https://pizzahut.com.br/menu";
        } 
        else{
            //card para messenger
            cartao = criarMessengerCard();
            cartao.title = pizza.descricao;
            cartao.subtitlesubtitle = `tamanho: ${pizza.tamanho}, 
            borda: ${pizza.borda}, 
            valor: R$${pizza.valor},
            ingredientes: ${pizza.ingredientes}`;
            cartao.image.src.rawUrl = pizza.urlImagem;
            cartao.actionLink = "https://pizzahut.com.br/menu";
        }
        listaCards.push(cartao);
    }
    return listaCards;
}