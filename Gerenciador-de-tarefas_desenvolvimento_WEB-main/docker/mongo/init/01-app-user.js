const dbName = "gerenciador_tarefas";
db.getSiblingDB(dbName).createUser({
  user: process.env.MONGO_APP_USER,
  pwd: process.env.MONGO_APP_PASSWORD,
  roles: [{ role: "readWrite", db: dbName }],
});