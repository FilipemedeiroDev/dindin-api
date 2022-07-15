const securePassword = require("secure-password");
const jwt = require("jsonwebtoken");
const jwtSegredo = require('../jwtSegredo');
const {
    encontrarUsuarioPeloEmail,
    salvarUsuario,
    atualizarSenhaUsuario,
    encontrarUsuarioPeloId,
    salvarUsuarioAtualizado
} = require('../modelos/usuarios')

const pwd = securePassword()

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'É obrigatório prencher o campo nome' })
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'É obrigatório prencher o campo email' })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'É obrigatório prencher o campo senha' })
    }

    try {
        const existePorEmail = await encontrarUsuarioPeloEmail(email);

        if (existePorEmail) {
            return res.status(400).json({ mensagem: 'Já existe um usuário com o e-mail informado.' })
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");

        const usuario = await salvarUsuario(nome, email, hash)

        return res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        });
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    };
}

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email) {
        return res.status(400).json({ mensagem: 'É obrigatório prencher o campo email' })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'É obrigatório prencher o campo senha' })
    }

    try {
        const usuario = await encontrarUsuarioPeloEmail(email);

        if (!usuario) {
            return res.status(400).json({ mensagem: "Usuário não encontrado." });
        }

        const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, "hex"));

        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json({ mensagem: "E-mail e/ou senha inválido(s)." });
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    atualizarSenhaUsuario(senha, email);
                } catch {
                }
                break;
        }

        const token = jwt.sign({
            id: usuario.id
        }, jwtSegredo, {
            expiresIn: "3h"
        });

        return res.status(200).json({
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            },
            token
        })

    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    };
}

const detalharUsuario = async (req, res) => {
    const { id: userId } = req.user;

    try {
        const usuarioEncontrado = await encontrarUsuarioPeloId(userId);

        if (!usuarioEncontrado) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' })
        }

        return res.status(200).json({
            id: usuarioEncontrado.id,
            nome: usuarioEncontrado.nome,
            email: usuarioEncontrado.email
        });
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    };
};

const atualizarUsuario = async (req, res) => {
    const { id: userId } = req.user;
    const { nome, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'É obrigatório prencher o campo nome' })
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'É obrigatório prencher o campo email' })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'É obrigatório prencher o campo senha' })
    }

    try {
        const usuarioEncontrado = await encontrarUsuarioPeloId(userId);

        if (!usuarioEncontrado) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' })
        }

        if (usuarioEncontrado.email !== email) {

            const existeEmail = await encontrarUsuarioPeloEmail(email);

            if (existeEmail) {
                return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' })
            }
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");

        await salvarUsuarioAtualizado(nome, email, hash, userId);

        return res.status(200).send()
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    };
};

module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario,
    atualizarUsuario
}