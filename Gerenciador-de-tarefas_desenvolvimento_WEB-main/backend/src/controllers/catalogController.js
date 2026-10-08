const pool=require('../config/postgres');
const config={
  areas:{table:'areas',fields:['nome','descricao'],list:'id,nome,descricao,ativo,created_at,updated_at'},
  setores:{table:'setores',fields:['nome','descricao','area_id'],list:'id,nome,descricao,area_id,ativo,created_at,updated_at'},
  funcoes:{table:'funcoes',fields:['nome','descricao'],list:'id,nome,descricao,ativo,created_at,updated_at'},
  equipes:{table:'equipes',fields:['nome','descricao','area_id','setor_id'],list:'id,nome,descricao,area_id,setor_id,ativo,created_at,updated_at'}
};
function valid(tipo){return config[tipo]||null;}
async function listar(req,res){const c=valid(req.params.tipo);if(!c)return res.status(404).json({mensagem:'Cadastro não encontrado.'});const r=await pool.query(`SELECT ${c.list} FROM ${c.table} ORDER BY nome`);res.json(r.rows);}
async function criar(req,res){const c=valid(req.params.tipo);if(!c)return res.status(404).json({mensagem:'Cadastro não encontrado.'});const vals=c.fields.map(f=>req.body[f]??null);if(!vals[0]||String(vals[0]).trim().length<2)return res.status(400).json({mensagem:'Nome é obrigatório.'});const cols=c.fields.join(',');const placeholders=c.fields.map((_,i)=>`$${i+1}`).join(',');const r=await pool.query(`INSERT INTO ${c.table}(${cols}) VALUES(${placeholders}) RETURNING ${c.list}` ,vals);res.status(201).json(r.rows[0]);}
async function atualizar(req,res){const c=valid(req.params.tipo);if(!c)return res.status(404).json({mensagem:'Cadastro não encontrado.'});const sets=c.fields.map((f,i)=>`${f}=COALESCE($${i+1},${f})`).join(',');const vals=c.fields.map(f=>req.body[f]??null);vals.push(req.params.id);const r=await pool.query(`UPDATE ${c.table} SET ${sets},updated_at=NOW() WHERE id=$${vals.length} RETURNING ${c.list}`,vals);if(!r.rowCount)return res.status(404).json({mensagem:'Registro não encontrado.'});res.json(r.rows[0]);}
async function excluir(req,res){const c=valid(req.params.tipo);if(!c)return res.status(404).json({mensagem:'Cadastro não encontrado.'});const r=await pool.query(`UPDATE ${c.table} SET ativo=false,updated_at=NOW() WHERE id=$1 RETURNING ${c.list}`,[req.params.id]);if(!r.rowCount)return res.status(404).json({mensagem:'Registro não encontrado.'});res.json({mensagem:'Registro desativado.',registro:r.rows[0]});}
module.exports={listar,criar,atualizar,excluir};
