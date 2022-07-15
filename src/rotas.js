const express = require('express');
const categoriaRoteador = require('./roteadores/categoriaRoteador');
const usuarioRoteador = require('./roteadores/usuarioRoteador');
const TransacoesRoteador = require('./roteadores/transacoesRoteador');

const rotas = express();

rotas.use(usuarioRoteador);
rotas.use(categoriaRoteador);
rotas.use(TransacoesRoteador);

module.exports = rotas;