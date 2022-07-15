const conexao = require('../conexao');

async function listarTodasCategorias() {
    const query = 'SELECT * FROM categorias'
    const { rows } = await conexao.query(query);

    return rows
}

async function buscarCategoriaPorId(categoria_id) {
    const query = 'SELECT * FROM categorias WHERE id= $1';

    const { rows } = await conexao.query(query, [categoria_id]);

    return rows[0]
};

module.exports = {
    listarTodasCategorias,
    buscarCategoriaPorId
}