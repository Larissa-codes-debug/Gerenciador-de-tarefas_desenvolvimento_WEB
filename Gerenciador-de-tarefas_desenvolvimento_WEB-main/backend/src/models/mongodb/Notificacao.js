const mongoose = require('mongoose');
const schema = new mongoose.Schema({ destinatarioId:{type:String,required:true,index:true}, tarefaId:String, tipo:{type:String,required:true}, titulo:{type:String,required:true}, mensagem:{type:String,required:true}, lida:{type:Boolean,default:false,index:true}, createdAt:{type:Date,default:Date.now,index:true} });
module.exports = mongoose.model('Notificacao', schema);
