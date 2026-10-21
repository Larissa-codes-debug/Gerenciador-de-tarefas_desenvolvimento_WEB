const mongoose = require('mongoose');
async function conectarMongoDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI é obrigatório.');
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    autoIndex: process.env.NODE_ENV !== 'production'
  });
  console.log('MongoDB conectado.');
}
module.exports = conectarMongoDB;