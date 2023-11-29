import Pedido from "../Modelo/pedido.js";
import conectar from "./conexao.js";

export default class PedidoDAO{
    async gravar(pedido){
        if (pedido instanceof Pedido){
            const conexao = await conectar();
            //let sql =`start transaction;`;
            //conexao.execute(sql);
            let sql = `INSERT INTO pedido (dataPedido) VALUES (?);`;
            let parametros = [pedido.dataPedido];
            const resultado = await conexao.execute(sql, parametros);
            pedido.id = resultado[0].insertId;
            for (const item of pedido.itensPedidos){
                //recuperar o código da pizza para cada item do pedido
                sql = `SELECT codigo FROM pizza WHERE descricao like ?`;
                const [registros] = await conexao.execute(sql, ['%' + item.pizza + '%']);
                item.codigo = registros[0].codigo;
                sql = `
                    INSERT INTO pedido_pizza(fk_id_pedido, fk_codigo_pizza, qtd)
                    VALUES (?,?,?);
                
                `
                parametros = [pedido.id, item.codigo, item.qtd];
                await conexao.execute(sql, parametros);
            }
            //sql = 'COMMIT;'
            //await conexao.execute(sql);
            global.poolConexoes.releaseConnection(conexao);
        }
    }
}