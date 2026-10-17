import express from 'express';
import config from './src/config/config.js';
import logger from './src/utils/logger.js';
import chalk from './src/utils/chalk.js';


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

app.get('/health', (req, res) => {
    res.status(200).json({
        message: 'Veg API is running',
        timestamp: new Date().toISOString(),
    });
});

const startServer = () => {
    app.listen(config.PORT, () => {
        logger.info(`Server is running on port ${config.PORT}`);
    });
};

startServer();

export default app;
