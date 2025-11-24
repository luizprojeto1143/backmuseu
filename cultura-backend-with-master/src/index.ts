import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./utils/data-source";
import app from "./app";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize().then(async () => { const {{ ensureMasterUser }} = await import('./utils/master-seeder'); await ensureMasterUser(); })
  .then(() => {
    console.log("📦 Conectado ao banco de dados");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao inicializar DataSource:", err);
  });
