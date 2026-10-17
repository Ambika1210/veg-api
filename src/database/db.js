import pg from 'pg';
import config from '../config/config.js';
import logger from '../utils/logger.js';

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

export const connectDB = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        logger.info('Database connected successfully', { time: result.rows[0].now });
        return result;
    } catch (error) {
        logger.error('Database connection error', { error: error.message });
        throw error;
    }
};

export default pool;
