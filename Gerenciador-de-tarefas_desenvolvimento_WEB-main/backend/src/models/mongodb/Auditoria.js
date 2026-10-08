const mongoose = require('mongoose');
const schema = new mongoose.Schema({ usuarioId:String, acao:{type:String,required:true}, recurso:String, recursoId:String, ip:String, detalhes:mongoose.Schema.Types.Mixed, createdAt:{type:Date,default:Date.now,index:true} });
module.exports = mongoose.model('Auditoria', schema);
