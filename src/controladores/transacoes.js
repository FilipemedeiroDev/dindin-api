const { listarTodasTransacoes, buscarTransacaoPorId, salvarTransacao, salvarTransacaoAtualizada, excluirTransacao } = require('../modelos/transacoes');
const { buscarCategoriaPorId } = require('../modelos/categorias')

const listarTransacoes = async (req, res) => {
    const { id: userId } = req.user;
    const { filtro } = req.query;

    try {
        const transacoes = await listarTodasTransacoes(userId);

        if (filtro) {
            const transacoesFiltradas = transacoes.filter(transacao => {
                return filtro.includes(transacao.categoria_nome)
            })
            return res.status(200).json(transacoesFiltradas);
        }

        return res.status(200).json(transacoes);
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

const detalharTransacao = async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.user;

    try {
        const transacaoEncontrada = await buscarTransacaoPorId(id, userId);

        if (!transacaoEncontrada) {
            return res.status(404).json({ mensagem: 'Transação não encontrada' })
        }

        return res.status(200).json(transacaoEncontrada)
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

const cadastrarTransacao = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body;
    const { id: userId } = req.user;

    if (!tipo || !descricao || !valor || !data || !categoria_id) {
        return res.status(400).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' })
    }

    const existeCategoria = await buscarCategoriaPorId(categoria_id);

    if (!existeCategoria) {
        return res.status(404).json({ mensagem: 'categoria_id informado não encontrado.' })
    }

    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(404).json({ mensagem: 'O campo tipo só pode receber os valores entrada ou saida.' })
    }

    const transacao = await salvarTransacao(userId, {
        tipo,
        descricao,
        valor,
        data,
        categoria_id
    })

    return res.status(200).json(transacao);
};

const atualizarTransacao = async (req, res) => {
    const { id: userId } = req.user;
    const { id } = req.params;
    const { tipo, descricao, valor, data, categoria_id } = req.body;

    if (!tipo || !descricao || !valor || !data || !categoria_id) {
        return res.status(400).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' })
    }

    try {
        const existeTransacao = await buscarTransacaoPorId(id, userId);

        if (!existeTransacao) {
            return res.status(404).json({ mensagem: 'Transação não encontrada.' })
        }

        const existeCategoria = await buscarCategoriaPorId(categoria_id);

        if (!existeCategoria) {
            return res.status(404).json({ mensagem: 'categoria_id informado não encontrado.' })
        }

        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.status(404).json({ mensagem: 'O campo tipo só pode receber os valores entrada ou saida.' })
        }

        await salvarTransacaoAtualizada(id, {
            tipo,
            descricao,
            valor,
            data,
            categoria_id
        })

        return res.status(200).send();
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

const deletarTransacao = async (req, res) => {
    const { id: userId } = req.user;
    const { id: idTransacao } = req.params;

    try {
        const existeTransacao = await buscarTransacaoPorId(idTransacao, userId);

        if (!existeTransacao) {
            return res.status(404).json({ mensagem: 'Transação não encontrada.' })
        }

        await excluirTransacao(idTransacao, userId);

        return res.status(200).send();
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

const obterExtratoTransacoes = async (req, res) => {
    const { id: userId } = req.user;
    let entrada = 0;
    let saida = 0;
    try {

        const transacoes = await listarTodasTransacoes(userId);

        for (const transacao of transacoes) {
            if (transacao.tipo === 'entrada') {
                entrada += transacao.valor
            } else {
                saida += transacao.valor
            }
        }

        return res.status(200).json({
            entrada,
            saida
        })
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    deletarTransacao,
    obterExtratoTransacoes
}