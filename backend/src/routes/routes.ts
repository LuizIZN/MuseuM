import express from 'express';
import { Request, Response } from 'express';
import { Pool } from 'pg';

const conn = require('../config/db');

const pool: Pool | undefined = conn();

const router = express.Router();

// rota principal
router.get('/', (req: Request, res: Response) => {
    res.send("API funcionando");
});


module.exports = {
    router
};

