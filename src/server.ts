// server.ts

import express from 'express';
import routes from './http/routes';
import { prisma } from './lib/prisma';


const app = express();

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;


// Testando a conexão com o banco de dados
prisma.$connect()
  .then(() => {
    // Iniciando o servidor Express se a conexão com o banco de dados for bem-sucedida
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    // Imprimindo um erro se não for possível conectar ao banco de dados
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Sair do processo com código de erro
  });
