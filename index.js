import express from 'express';
import config from './src/config/config.js';
import logger from './src/utils/logger.js';
import chalk from './src/utils/chalk.js';
import { connectDB } from './src/database/db.js';
import userRouter from './src/modules/users/user.route.js';
import authRouter from './src/modules/auth/auth.route.js';
import productRouter from './src/modules/products/product.route.js';


const app = express();

app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use((req, res, next) => {
    const { hostname, originalUrl, protocol, method } = req;
    logger.info(`${method === 'GET' ? chalk.getReq(method) : chalk.postReq(method)}  ${protocol}://${hostname}:${config.PORT}${originalUrl}`);
    next();
});

// Routes
app.use('/v1', userRouter);
app.use('/v1', authRouter);
app.use('/v1', productRouter);

app.get('/health', (req, res) => {
    res.status(200).json({
        message: 'Veg API is running',
        timestamp: new Date().toISOString(),
    });
});

const startServer = async () => {
    await connectDB()

    app.listen(config.PORT, () => {
        logger.info(`Server is running on port ${config.PORT}`);
    });
};

startServer();

export default app;
