const jwt = require('jsonwebtoken');
function criarAccessToken(usuario){ return jwt.sign({id:usuario.id,perfil:usuario.perfil}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRES_IN || '15m'}); }
function verificarAccessToken(token){ return jwt.verify(token, process.env.JWT_SECRET); }
module.exports={criarAccessToken,verificarAccessToken};
