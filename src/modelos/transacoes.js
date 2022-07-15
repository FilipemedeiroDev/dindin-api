const conexao = require('../conexao');

async function listarTodasTransacoes(userId) {
    const query =
        `
    SELECT transacoes.*, categorias.descricao as categoria_nome
    FROM 
    transacoes 
    JOIN categorias on transacoes.categoria_id = categorias.id
    WHERE 
    usuario_id =$1
    `
    const { rows } = await conexao.query(query, [userId]);

    return rows
}

async function buscarTransacaoPorId(idTransacao, userId) {
    const query =
        `
        SELECT transacoes.*, categorias.descricao as categoria_nome
        FROM 
        transacoes 
        JOIN categorias on transacoes.categoria_id = categorias.id 
        WHERE transacoes.id = $1 
        AND usuario_id =$2
    `;

    const { rows } = await conexao.query(query, [idTransacao, userId]);

    return rows[0]
}

async function salvarTransacao(userId, transacao) {
    const query = `INSERT INTO transacoes (tipo, descricao, valor, data, categoria_id, usuario_id) VALUES ($1, $2, $3, $4, $5, $6) returning id`
    const { rows } = await conexao.query(query, [transacao.tipo, transacao.descricao, transacao.valor, transacao.data, transacao.categoria_id, userId]);

    const { id: transacaoId } = rows[0];

    return buscarTransacaoPorId(transacaoId, userId);
};

async function salvarTransacaoAtualizada(idTransacao, transacao) {
    const query = `UPDATE transacoes SET tipo = $1, descricao = $2, valor = $3, data = $4, categoria_id = $5 WHERE id = $6`;

    return await conexao.query(query, [transacao.tipo, transacao.descricao, transacao.valor, transacao.data, transacao.categoria_id, idTransacao])
};

async function excluirTransacao(idTransacao, userId) {
    const query = 'DELETE FROM transacoes WHERE id = $1 AND usuario_id = $2'

    return await conexao.query(query, [idTransacao, userId])
};

module.exports = {
    listarTodasTransacoes,
    buscarTransacaoPorId,
    salvarTransacao,
    salvarTransacaoAtualizada,
    excluirTransacao
}