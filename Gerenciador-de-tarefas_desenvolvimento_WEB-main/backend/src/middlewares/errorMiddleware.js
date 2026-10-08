function notFound(req,res){res.status(404).json({mensagem:'Rota não encontrada.'});}
function errorHandler(err,req,res,next){ console.error(err); if(res.headersSent)return next(err); const status=err.status||500; res.status(status).json({mensagem:err.message||'Erro interno do servidor.'}); }
module.exports={notFound,errorHandler};
