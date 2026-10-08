const Notificacao=require('../models/mongodb/Notificacao');
async function notificarUsuarios(ids,{tarefaId,tipo,titulo,mensagem}){ const unique=[...new Set((ids||[]).filter(Boolean).map(String))]; if(!unique.length)return; await Notificacao.insertMany(unique.map(destinatarioId=>({destinatarioId,tarefaId,tipo,titulo,mensagem}))); }
module.exports={notificarUsuarios};
