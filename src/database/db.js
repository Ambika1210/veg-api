import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/config.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
    connectionString: config.DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.on('connect', () => {
    logger.info('PostgreSQL client connected to pool');
});

pool.on('error', (err) => {
    logger.error('Unexpected error on idle PostgreSQL client', { error: err.message });
});

export const initDB = async () => {
    try {
        const sqlPath = path.join(__dirname, '../initialDb.sql');
        const sql = await fs.readFile(sqlPath, 'utf-8');
        await pool.query(sql);
        logger.info('Database tables initialized successfully');
    } catch (error) {
        logger.error('Database table initialization error', { error: error.message });
        throw error;
    }
};

export const connectDB = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        logger.info('Database connected successfully', { time: result.rows[0].now });
        await initDB();
        return result;
    } catch (error) {
        logger.error('Database connection error', { error: error.message });
        throw error;
    }
};

export default pool;
