import express from 'express';
import cors from 'cors';
require('dotenv').config();

// rotas
const { router } = require('./routes/routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(router);

require('./config/db');

const PORT = process.env.APP_PORT;
const HOST = process.env.APP_HOST;

app.listen(PORT, () => console.log(`Server running on port ${HOST}:${PORT}`));