const mongoose = require('mongoose');
const schema = new mongoose.Schema({ tarefaId:{type:String,required:true,index:true}, usuarioId:{type:String,required:true}, percentual:{type:Number,required:true,min:0,max:100}, motivo:{type:String,required:true,trim:true,maxlength:2000}, aprovadoPor:String, createdAt:{type:Date,default:Date.now} });
module.exports = mongoose.model('Justificativa', schema);
