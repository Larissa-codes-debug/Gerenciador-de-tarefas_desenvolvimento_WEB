const mongoose = require('mongoose');
const schema = new mongoose.Schema({ tarefaId:{type:String,required:true,index:true}, usuarioId:{type:String,required:true}, texto:{type:String,required:true,trim:true,maxlength:4000}, createdAt:{type:Date,default:Date.now} });
module.exports = mongoose.model('Observacao', schema);
