// routes/index.ts

import express from 'express';
import userRoutes from './userRoutes';
// Importe outros arquivos de rotas, se houver

const router = express.Router();

// Use as rotas definidas em cada arquivo de rota
router.use('/users', userRoutes);
// Use outras rotas, se houver

export default router;
