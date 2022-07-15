const express = require('express');
const validarToken = require('../intermediarios/autenticacao');
const { listarCategorias } = require('../controladores/categorias');

const rotaCategorias = express.Router();

rotaCategorias.get('/categoria', validarToken, listarCategorias);


module.exports = rotaCategorias;