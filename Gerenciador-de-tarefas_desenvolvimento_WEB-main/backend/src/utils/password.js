const bcrypt=require('bcrypt');
const hashSenha=senha=>bcrypt.hash(senha,12);
const compararSenha=(senha,hash)=>bcrypt.compare(senha,hash);
module.exports={hashSenha,compararSenha};
