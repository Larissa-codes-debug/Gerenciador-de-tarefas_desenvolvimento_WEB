const mongoose = require('mongoose');
const schema = new mongoose.Schema({ tokenHash:{type:String,required:true,index:true}, usuarioId:{type:String,required:true,index:true}, expiresAt:{type:Date,required:true,index:{expires:0}}, revokedAt:Date, createdAt:{type:Date,default:Date.now} });
module.exports = mongoose.model('RefreshToken', schema);
