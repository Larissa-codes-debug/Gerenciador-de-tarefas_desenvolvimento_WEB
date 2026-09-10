const express = require("express");
const cors = require("cors");

const conectarMongoDB = require("./config/mongodb");
const inicializarBanco = require("./config/initDatabase");

const authRoutes = require("./routes/authRoutes");
const tarefaRoutes = require("./routes/tarefaRoutes");
const areaRoutes = require("./routes/areaRoutes");
const setorRoutes = require("./routes/setorRoutes");
const funcaoRoutes = require("./routes/funcaoRoutes");
const equipeRoutes = require("./routes/equipeRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const notificacaoRoutes = require("./routes/notificacaoRoutes");
const relatorioRoutes = require("./routes/relatorioRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mensagem: "API funcionando"
  });
});

// Autenticação
app.use("/api/auth", authRoutes);

// PostgreSQL
app.use("/api/tarefas", tarefaRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/setores", setorRoutes);
app.use("/api/funcoes", funcaoRoutes);
app.use("/api/equipes", equipeRoutes);
app.use("/api/usuarios", usuarioRoutes);

// MongoDB
app.use("/api/notificacoes", notificacaoRoutes);
app.use("/api/relatorios", relatorioRoutes);

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    await conectarMongoDB();

    await inicializarBanco();

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
  }
}

iniciarServidor();