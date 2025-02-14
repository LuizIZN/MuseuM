import express from 'express';
import { Request, Response } from 'express';
import { Pool } from 'pg';
import FuncionarioController from '../controllers/FuncionarioController';

const conn = require('../config/db');

const pool: Pool | undefined = conn();

const router = express.Router();

// rota principal
router.get('/', (req: Request, res: Response) => {
    res.send("API funcionando");
});

// rotas funcionarios
const funcionarioController = new FuncionarioController(pool);

router.post('/funcionario', funcionarioController.criarFuncionario);



module.exports = {
    router
};

