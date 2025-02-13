import { Pool } from "pg";
require('dotenv').config();

const conn = (): Pool | undefined => {
    try {
        const pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT as string),
        });

        console.log('Connected to the database');
        return pool;
    } catch (err: any) {
        console.log('Error connecting to the database', err);
    }
};

module.exports = conn;