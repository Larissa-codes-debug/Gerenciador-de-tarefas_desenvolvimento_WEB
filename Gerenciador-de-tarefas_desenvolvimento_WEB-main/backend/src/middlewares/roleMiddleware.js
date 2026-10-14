function permitir(...perfis){ return (req,res,next)=>{ if(!req.usuario||!perfis.includes(req.usuario.perfil)) return res.status(403).json({mensagem:'Você não possui permissão para esta operação.'}); next(); }; }
module.exports=permitir;
