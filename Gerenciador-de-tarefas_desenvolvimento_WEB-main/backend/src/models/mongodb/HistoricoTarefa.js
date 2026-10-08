const mongoose = require('mongoose');
const schema = new mongoose.Schema({ tarefaId:{type:String,required:true,index:true}, usuarioId:{type:String,required:true}, acao:{type:String,required:true}, valorAnterior:String, valorNovo:String, createdAt:{type:Date,default:Date.now,index:true} }, {_id:true});
module.exports = mongoose.model('HistoricoTarefa', schema);
