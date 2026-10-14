const mongoose = require('mongoose');
async function conectarMongoDB() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gerenciador_tarefas');
  console.log('MongoDB conectado!');
}
module.exports = conectarMongoDB;
