const express = require('express');
const validarToken = require('../intermediarios/autenticacao');
const { listarTransacoes, detalharTransacao, cadastrarTransacao, atualizarTransacao, deletarTransacao, obterExtratoTransacoes } = require('../controladores/transacoes');

const rotasTransacoes = express.Router();

rotasTransacoes.get('/transacao', validarToken, listarTransacoes);
rotasTransacoes.get('/transacao/extrato', validarToken, obterExtratoTransacoes);
rotasTransacoes.get('/transacao/:id', validarToken, detalharTransacao);
rotasTransacoes.post('/transacao', validarToken, cadastrarTransacao);
rotasTransacoes.put('/transacao/:id', validarToken, atualizarTransacao);
rotasTransacoes.delete('/transacao/:id', validarToken, deletarTransacao);

module.exports = rotasTransacoes;