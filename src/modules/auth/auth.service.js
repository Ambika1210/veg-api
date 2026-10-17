import { generateToken } from '../../middleware/auth.middleware.js';
import { findUserForAuth } from './auth.repository.js';
import logger from '../../utils/logger.js';

class AuthService {
    loginUser = async ({ email, mobile_number, password }) => {
        try {
            const user = await findUserForAuth({ email, mobile_number });
            if (!user) {
                throw new Error('Invalid email/mobile number or password');
            }

            if (!user.is_active) {
                throw new Error('User account is deactivated');
            }

            if (user.password !== password) {
                throw new Error('Invalid email/mobile number or password');
            }

            const token = generateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            const { password: _, ...userData } = user;

            return {
                user: userData,
                token,
            };
        } catch (error) {
            logger.error(`AuthService >>>> loginUser >>>> Error: ${error.message}`, {
                email,
                mobile_number,
                error: error.message,
            });
            throw error;
        }
    };
}

const authService = new AuthService();
export default authService;
