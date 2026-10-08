const {verificarAccessToken}=require('../utils/jwt');
function autenticar(req,res,next){
  try{
    const [tipo,token]=(req.headers.authorization||'').split(' ');
    if(tipo!=='Bearer'||!token) return res.status(401).json({mensagem:'Token não informado ou formato inválido.'});
    req.usuario=verificarAccessToken(token); next();
  }catch(e){return res.status(401).json({mensagem:'Token inválido ou expirado.'});}
}
module.exports=autenticar;
