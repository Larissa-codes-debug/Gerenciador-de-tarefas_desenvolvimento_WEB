const Auditoria=require('../models/mongodb/Auditoria');
async function auditar(req,acao,recurso,recursoId,detalhes={}){ try{ await Auditoria.create({usuarioId:req.usuario?.id,acao,recurso,recursoId,ip:req.ip,detalhes}); }catch(e){console.error('Falha auditoria:',e.message);} }
module.exports={auditar};
