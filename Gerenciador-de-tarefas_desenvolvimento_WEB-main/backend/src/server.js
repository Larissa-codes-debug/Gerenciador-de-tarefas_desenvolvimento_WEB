require("dotenv").config();

const express = require("express");
const cors = require("cors");

const conectarMongoDB = require("./config/mongodb");
const inicializarBanco = require("./config/initDatabase");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mensagem: "API funcionando"
  });
});

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