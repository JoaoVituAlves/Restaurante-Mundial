import Pizza from "../Modelo/pizza.js";
import conectar from "./conexao.js";

export default class PizzaDAO{

    async gravar(pizza){
        if (pizza instanceof Pizza){
            const sql ='INSERT INTO pizza (descricao, tamanho, borda, valor, urlImagem, ingredientes) VALUES (?, ?, ?, ?, ?, ?)';
            const parametros = [pizza.descricao, pizza.tamanho, pizza.borda, pizza.valor, pizza.urlImagem, pizza.ingredientes];
            const conexao = await conectar();
            const resultado = await conexao.execute(sql, parametros);
            pizza.codigo = resultado[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(pizza){
        if (pizza instanceof Pizza){
            const sql =`UPDATE pizza SET descricao = ?, tamanho = ?, borda = ?,
                        valor = ?, urlImagem = ?, ingredientes =? WHERE codigo = ?`;
            const parametros = [pizza.descricao, pizza.tamanho, pizza.borda, pizza.valor, pizza.urlImagem, pizza.ingredientes, pizza.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(pizza){
        if (pizza instanceof Pizza){
            const sql =`DELETE FROM pizza WHERE codigo = ?`;
            const parametros = [pizza.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }

    }

    async consultar(){
        const sql =`SELECT * FROM pizza`;
        const conexao = await conectar();
        const [registros, campos] = await conexao.execute(sql);
        let listaPizzas = [];
        for (const registro of registros){
            const pizza = new Pizza(registro.codigo, registro.descricao, registro.tamanho, registro.borda, registro.valor, registro.urlImagem, registro.ingredientes);
            listaPizzas.push(pizza);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaPizzas;
    }
}