import jwt from 'jsonwebtoken';
import NodeCache from 'node-cache';
import serverConfig from '../config/config.js';
import { hasPermission } from './permission.js';
import { findUserById } from '../modules/users/user.repository.js';
import logger from '../utils/logger.js';
import { setAuthContext } from './contextStore.js';

// Cache decoded JWTs for 1 minute
const tokenCache = new NodeCache({ stdTTL: 60 });

function verifyToken(token) {
    const cached = tokenCache.get(token);
    if (cached) return cached;
    const decoded = jwt.verify(token, serverConfig.JWT_SECRET);
    tokenCache.set(token, decoded);
    return decoded;
}

function generateToken(payload) {
    try {
        const userId = payload.userId || payload.id;
        logger.info(`generateToken >>>> Generating token for userId: ${userId}`);
        const token = jwt.sign(payload, serverConfig.JWT_SECRET, {
            expiresIn: serverConfig.JWT_EXPIRES_IN,
        });
        logger.info(`generateToken >>>> Token generated successfully for userId: ${userId}`);
        return token;
    } catch (error) {
        logger.error(`generateToken >>>> Error generating token: ${error.message}`, {
            stack: error.stack,
            userId: payload?.userId || payload?.id,
        });
        throw error;
    }
}

// Fetch user by ID and validate existence in PostgreSQL
async function fetchUserById(userId) {
    const existingUser = await findUserById(userId);

    if (!existingUser) {
        throw new Error('User not found');
    }

    if (existingUser.is_deleted) {
        throw new Error('User deleted');
    }

    if (existingUser.is_active === false) {
        throw new Error('User inactive');
    }

    return existingUser;
}

function checkPermission(requiredPermission) {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ success: false, message: 'No token provided' });
            }

            const payload = verifyToken(token);
            const userId = payload.userId || payload.id;

            if (!userId) {
                return res.status(401).json({ success: false, message: 'Invalid token payload' });
            }

            try {
                const existingUser = await fetchUserById(userId);

                if (requiredPermission && !hasPermission(existingUser.role, requiredPermission)) {
                    logger.warn(`checkPermission >>>> Access Denied for User: ${userId} | Role: ${existingUser.role} | Required: ${requiredPermission}`);
                    return res.status(403).json({ success: false, message: 'Insufficient permissions' });
                }

                // Enrich request context using separate helper
                setAuthContext(req, { ...payload, ...existingUser });

                next();
            } catch (err) {
                if (err.message === 'User not found') return res.status(404).json({ success: false, message: 'User not found' });
                if (err.message === 'User deleted') return res.status(404).json({ success: false, message: 'User has been deleted' });
                if (err.message === 'User inactive') return res.status(403).json({ success: false, message: 'User account is inactive' });
                throw err;
            }
        } catch (err) {
            logger.error(`checkPermission Error: ${err.message}`);
            return res.status(401).json({ success: false, message: 'Session expired. Please login again' });
        }
    };
}

const protectRoutes = {
    checkPermission,
};

export { checkPermission, generateToken, verifyToken };
export default protectRoutes;
