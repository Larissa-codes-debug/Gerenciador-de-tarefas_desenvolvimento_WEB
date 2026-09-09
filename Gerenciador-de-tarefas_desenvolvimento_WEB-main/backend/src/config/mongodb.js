const mongoose = require("mongoose");

async function conectarMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB conectado!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
}

module.exports = conectarMongoDB;