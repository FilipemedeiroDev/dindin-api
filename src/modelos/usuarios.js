const conexao = require('../conexao');

async function encontrarUsuarioPeloEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1';

    const { rows } = await conexao.query(query, [email]);

    return rows[0]
}

async function salvarUsuario(nome, email, senha) {
    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) returning *';
    const usuarioResultado = await conexao.query(query, [nome, email, senha]);

    if (usuarioResultado.rowCount === 0) {
        return res.status(400).json({ mensagem: 'Não foi possivel cadastrar o usuãrio.' });
    }

    const [usuario] = usuarioResultado.rows;

    return usuario
}

async function salvarUsuarioAtualizado(nome, email, senha, userId) {
    const query = 'UPDATE usuarios SET nome = $1, email= $2, senha= $3 WHERE id = $4   ';

    return await conexao.query(query, [nome, email, senha, userId]);
}

async function atualizarSenhaUsuario(senha, email) {
    const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
    const query = 'UPDATE usuarios SET senha = $1 WHERE email = $2';
    await conexao.query(query, [hash, email]);
}

async function encontrarUsuarioPeloId(id) {
    const query = 'SELECT * FROM usuarios WHERE id = $1';
    const { rows } = await conexao.query(query, [id]);

    return rows[0]
}

module.exports = {
    encontrarUsuarioPeloEmail,
    salvarUsuario,
    atualizarSenhaUsuario,
    encontrarUsuarioPeloId,
    salvarUsuarioAtualizado
}