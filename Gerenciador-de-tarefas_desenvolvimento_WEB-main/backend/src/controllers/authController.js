const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool = require('../config/postgres');
const RefreshToken = require('../models/mongodb/RefreshToken');
const { hashSenha, compararSenha } = require('../utils/password');
const { criarAccessToken } = require('../utils/jwt');

const DIAS_REFRESH = () => {
  const dias = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7);
  return Number.isInteger(dias) && dias > 0 ? Math.min(dias, 30) : 7;
};
const MIN_SENHA = 12;
const MAX_SENHA_BYTES = 72; // limite efetivo do bcrypt

function gerarTokenAleatorio() {
  return crypto.randomBytes(48).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function senhaValida(senha) {
  return typeof senha === 'string' && senha.length >= MIN_SENHA &&
    Buffer.byteLength(senha, 'utf8') <= MAX_SENHA_BYTES;
}

async function salvarRefresh(usuarioId, token) {
  const expiresAt = new Date(Date.now() + DIAS_REFRESH() * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ tokenHash: hashToken(token), usuarioId: String(usuarioId), expiresAt });
}

function dadosPublicos(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
    area_id: usuario.area_id,
    setor_id: usuario.setor_id,
    funcao_id: usuario.funcao_id
  };
}

async function registrar(req, res) {
  try {
    const nome = typeof req.body.nome === 'string' ? req.body.nome.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const senha = req.body.senha;

    if (!nome || nome.length > 120 || !email || !emailValido(email) || email.length > 254) {
      return res.status(400).json({ mensagem: 'Informe nome e e-mail válidos.' });
    }
    if (!senhaValida(senha)) {
      return res.status(400).json({ mensagem: 'A senha deve ter pelo menos 12 caracteres e no máximo 72 bytes.' });
    }

    const hash = await hashSenha(senha);
    const resultado = await pool.query(
      `INSERT INTO usuarios(nome,email,senha_hash,perfil,area_id,setor_id,funcao_id)
       VALUES($1,$2,$3,'USUARIO',$4,$5,$6)
       RETURNING id,nome,email,perfil,area_id,setor_id,funcao_id,ativo`,
      [nome, email, hash, req.body.area_id || null, req.body.setor_id || null, req.body.funcao_id || null]
    );

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso.',
      usuario: dadosPublicos(resultado.rows[0])
    });
  } catch (erro) {
    if (erro.code === '23505') {
      return res.status(409).json({ mensagem: 'E-mail já cadastrado.' });
    }
    if (erro.code === '23503' || erro.code === '22P02') {
      return res.status(400).json({ mensagem: 'Área, setor ou função informados são inválidos.' });
    }
    console.error('Erro ao cadastrar usuário:', erro.message);
    return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
  }
}

async function login(req, res) {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const senha = typeof req.body.senha === 'string' ? req.body.senha : '';
    if (!email || !senha || email.length > 254) {
      return res.status(400).json({ mensagem: 'Informe e-mail e senha.' });
    }

    const resultado = await pool.query(
      `SELECT id,nome,email,senha_hash,perfil,area_id,setor_id,funcao_id,ativo
       FROM usuarios WHERE email=$1 LIMIT 1`,
      [email]
    );
    if (!resultado.rowCount) {
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }

    const usuario = resultado.rows[0];
    if (!usuario.ativo) {
      return res.status(403).json({ mensagem: 'Usuário bloqueado ou inativo.' });
    }
    if (!(await compararSenha(senha, usuario.senha_hash))) {
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }

    const accessToken = criarAccessToken(usuario);
    const refreshToken = gerarTokenAleatorio();
    await salvarRefresh(usuario.id, refreshToken);

    return res.json({
      mensagem: 'Login realizado com sucesso.',
      token: accessToken,
      refreshToken,
      usuario: dadosPublicos(usuario)
    });
  } catch (erro) {
    console.error('Erro ao realizar login:', erro.message);
    return res.status(500).json({ mensagem: 'Erro ao realizar login.' });
  }
}

async function refresh(req, res) {
  try {
    const token = typeof req.body.refreshToken === 'string' ? req.body.refreshToken : '';
    if (!token || token.length > 512) {
      return res.status(400).json({ mensagem: 'Refresh token obrigatório.' });
    }

    const agora = new Date();
    // Consumo atômico: somente uma requisição pode revogar/consumir este token.
    const registro = await RefreshToken.findOneAndUpdate(
      { tokenHash: hashToken(token), revokedAt: null, expiresAt: { $gt: agora } },
      { $set: { revokedAt: agora } },
      { new: false }
    );

    if (!registro) {
      return res.status(401).json({ mensagem: 'Refresh token inválido, expirado ou já utilizado.' });
    }

    const resultado = await pool.query(
      `SELECT id,nome,email,perfil,area_id,setor_id,funcao_id,ativo
       FROM usuarios WHERE id=$1 LIMIT 1`,
      [registro.usuarioId]
    );
    const usuario = resultado.rows[0];
    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ mensagem: 'Usuário inválido ou inativo.' });
    }

    const novoRefreshToken = gerarTokenAleatorio();
    await salvarRefresh(usuario.id, novoRefreshToken);

    return res.json({
      token: criarAccessToken(usuario),
      refreshToken: novoRefreshToken,
      usuario: dadosPublicos(usuario)
    });
  } catch (erro) {
    console.error('Erro ao renovar sessão:', erro.message);
    return res.status(500).json({ mensagem: 'Erro ao renovar sessão.' });
  }
}

async function logout(req, res) {
  try {
    const token = typeof req.body.refreshToken === 'string' ? req.body.refreshToken : '';
    if (token && token.length <= 512) {
      await RefreshToken.updateOne(
        { tokenHash: hashToken(token), revokedAt: null },
        { $set: { revokedAt: new Date() } }
      );
    }
    return res.json({ mensagem: 'Sessão encerrada.' });
  } catch (erro) {
    console.error('Erro ao encerrar sessão:', erro.message);
    return res.status(500).json({ mensagem: 'Erro ao encerrar sessão.' });
  }
}

async function me(req, res) {
  try {
    const resultado = await pool.query(
      `SELECT id,nome,email,perfil,area_id,setor_id,funcao_id,ativo,created_at
       FROM usuarios WHERE id=$1 LIMIT 1`,
      [req.usuario.id]
    );
    if (!resultado.rowCount) return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    return res.json(resultado.rows[0]);
  } catch (erro) {
    console.error('Erro ao consultar usuário autenticado:', erro.message);
    return res.status(500).json({ mensagem: 'Erro ao consultar usuário.' });
  }
}

async function forgotPassword(req, res) {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const respostaGenerica = { mensagem: 'Se o e-mail existir, as instruções serão enviadas.' };
    if (!email || email.length > 254 || !emailValido(email)) return res.json(respostaGenerica);

    const resultado = await pool.query(
      'SELECT id,email FROM usuarios WHERE email=$1 AND ativo=true LIMIT 1', [email]
    );
    if (!resultado.rowCount) return res.json(respostaGenerica);

    const token = gerarTokenAleatorio();
    await RefreshToken.create({
      tokenHash: `reset:${hashToken(token)}`,
      usuarioId: String(resultado.rows[0].id),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000)
    });

    if (process.env.SMTP_HOST) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      });
      const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${encodeURIComponent(token)}`;
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Redefinição de senha',
        text: `Para redefinir sua senha, acesse: ${url}`
      });
    }

    return res.json({
      ...respostaGenerica,
      devToken: process.env.NODE_ENV !== 'production' && process.env.EXPOSE_RESET_TOKEN_IN_DEV === 'true' ? token : undefined
    });
  } catch (erro) {
    console.error('Erro ao solicitar redefinição de senha:', erro.message);
    return res.status(500).json({ mensagem: 'Não foi possível processar a solicitação.' });
  }
}

async function resetPassword(req, res) {
  try {
    const token = typeof req.body.token === 'string' ? req.body.token : '';
    const senha = req.body.senha;
    if (!token || token.length > 512 || !senhaValida(senha)) {
      return res.status(400).json({ mensagem: 'Token e nova senha válida (mínimo 12 caracteres e máximo 72 bytes) são obrigatórios.' });
    }

    const agora = new Date();
    // Também consome o token de redefinição uma única vez.
    const registro = await RefreshToken.findOneAndUpdate(
      { tokenHash: `reset:${hashToken(token)}`, revokedAt: null, expiresAt: { $gt: agora } },
      { $set: { revokedAt: agora } },
      { new: false }
    );
    if (!registro) return res.status(400).json({ mensagem: 'Token inválido, expirado ou já utilizado.' });

    await pool.query(
      'UPDATE usuarios SET senha_hash=$1,updated_at=NOW() WHERE id=$2',
      [await hashSenha(senha), registro.usuarioId]
    );
    await RefreshToken.updateMany(
      { usuarioId: registro.usuarioId, revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );

    return res.json({ mensagem: 'Senha alterada com sucesso. Entre novamente.' });
  } catch (erro) {
    console.error('Erro ao redefinir senha:', erro.message);
    return res.status(500).json({ mensagem: 'Erro ao redefinir senha.' });
  }
}

module.exports = { registrar, login, refresh, logout, me, forgotPassword, resetPassword };
