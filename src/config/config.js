import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT: process.env.PORT || 7173,
    STAGE: process.env.STAGE || 'development',
    JWT_SECRET: process.env.JWT_SECRET || "vegApiqqqqqqqqqqwww",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    LOG_MAX_FILES: process.env.LOG_MAX_FILES || '7d',
    DATABASE: process.env.DATABASE || process.env.DATABASE_URL,
    COOKIE_MAX_AGE: Number(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
};

export default config;