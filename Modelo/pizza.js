export default class Pizza{
    #codigo;
    #descricao;
    #tamanho;
    #borda;
    #valor;
    #ingredientes;

    constructor(codigo, descricao, tamanho, borda, valor, ingredientes=[]){
        this.#codigo = codigo;
        this.#descricao = descricao;
        this.#tamanho = tamanho;
        this.#borda = borda;
        this.#valor = valor;
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

    //override do método toJSON()
    toJSON(){
        return {
            'codigo': this.#codigo,
            'descricao': this.#descricao,
            'tamanho': this.#tamanho,
            'borda': this.#borda,
            'valor': this.#valor,
            'ingredientes': this.#ingredientes
        }
    }
}