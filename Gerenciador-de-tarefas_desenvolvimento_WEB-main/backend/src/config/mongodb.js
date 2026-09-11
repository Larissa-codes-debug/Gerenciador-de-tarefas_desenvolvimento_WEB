require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env")
});

const mongoose = require("mongoose");

async function conectarMongoDB() {
    try {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error(
                "MONGODB_URI não foi encontrada no arquivo .env"
            );
        }

        await mongoose.connect(uri);

        console.log("MongoDB conectado!");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error.message);
        process.exit(1);
    }
}

module.exports = conectarMongoDB;