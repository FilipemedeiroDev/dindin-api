const { listarTodasCategorias } = require('../modelos/categorias');

const listarCategorias = async (req, res) => {
    try {
        const categorias = await listarTodasCategorias();

        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

module.exports = {
    listarCategorias
}