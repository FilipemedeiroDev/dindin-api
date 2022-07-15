const express = require('express')
const { cadastrarUsuario, login, detalharUsuario, atualizarUsuario } = require('../controladores/usuarios');
const validarToken = require('../intermediarios/autenticacao');

const rotasUsuario = express.Router();

rotasUsuario.post('/usuario', cadastrarUsuario)
rotasUsuario.post('/login', login);
rotasUsuario.get('/usuario', validarToken, detalharUsuario);
rotasUsuario.put('/usuario', validarToken, atualizarUsuario);

module.exports = rotasUsuario;