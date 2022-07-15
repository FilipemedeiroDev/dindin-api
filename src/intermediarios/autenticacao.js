const jwt = require("jsonwebtoken");
const jwtSegredo = require('../jwtSegredo')

const validarToken = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' })
    }

    const [, token] = authorization.split('Bearer ');

    if (!token) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' })
    }

    try {
        const decoded = jwt.verify(token, jwtSegredo);

        req.user = {
            id: decoded.id
        }

        return next()
    } catch {
        return res.status(401).json({ mensagem: 'Token inválido.' })
    }
}

module.exports = validarToken;