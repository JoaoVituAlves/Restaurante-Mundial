import PizzaDAO from "../Persistencia/pizzaDAO.js";

export default class Pizza{
    #codigo;
    #descricao;
    #tamanho;
    #borda;
    #valor;
    #urlImagem;
    #ingredientes;

    constructor(codigo, descricao, tamanho, borda, valor, urlImagem, ingredientes){
        this.#codigo = codigo;
        this.#descricao = descricao;
        this.#tamanho = tamanho;
        this.#borda = borda;
        this.#valor = valor;
        this.#urlImagem = urlImagem;
        this.#ingredientes = ingredientes;
    }

    get codigo(){
        return this.#codigo;
    }

    set codigo(novoCodigo){
        this.#codigo = novoCodigo;
    }

    get descricao(){
        return this.#descricao;
    }

    set descricao(novaDescricao){
        this.#descricao = novaDescricao;
    }

    get tamanho(){
        return this.#tamanho;
    }

    set tamanho(novoTamanho){
        this.#tamanho = novoTamanho;
    }

    get borda(){
        return this.#borda;
    }

    set borda(novaBorda){
        this.#borda = novaBorda;
    }

    get valor(){
        return this.#valor;
    }

    set valor(novoValor){
        this.#valor = novoValor;
    }

    get ingredientes(){
        return this.#ingredientes;
    }

    set ingredientes(novosIngredientes){
        this.#ingredientes = novosIngredientes;
    }

    get urlImagem(){
        return this.#urlImagem;
    }

    set urlImagem(novaUrl){
        this.#urlImagem = novaUrl;
    }

    //override do método toJSON()
    toJSON(){
        return {
            'codigo': this.#codigo,
            'descricao': this.#descricao,
            'tamanho': this.#tamanho,
            'borda': this.#borda,
            'valor': this.#valor,
            'urlImagem': this.#urlImagem,
            'ingredientes': this.#ingredientes
        }
    }

    async gravar(){
        //DAO = Data Access Object
        const pizzaDAO = new PizzaDAO();
        await pizzaDAO.gravar(this);
    }

    async atualizar(){
        const pizzaDAO = new PizzaDAO();
        await pizzaDAO.atualizar(this);
    }

    async excluir(){
        const pizzaDAO = new PizzaDAO();
        await pizzaDAO.excluir(this);
    }

    async consultar(termoBusca){
        const pizzaDAO = new PizzaDAO();
        return await pizzaDAO.consultar(termoBusca);
    }

}