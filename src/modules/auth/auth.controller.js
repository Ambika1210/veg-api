import authService from './auth.service.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

class AuthController {
    login = async (req, res) => {
        try {
            const { email, mobile_number, password } = req.body;

            const result = await authService.loginUser({
                email,
                mobile_number,
                password,
            });

            logger.info(`AuthController >>>> login >>>> User ${result.user.id} logged in successfully`, { userId: result.user.id, email: result.user.email, role: result.user.role });

            res.cookie('token', result.token, {
                httpOnly: true,
                secure: config.STAGE === 'production',
                sameSite: 'lax',
                maxAge: config.COOKIE_MAX_AGE,
            });

            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        } catch (error) {
            logger.error(`AuthController >>>> login >>>> Login failed: ${error.message}`, {
                error: error.message,
            });

            if (
                error.message.includes('Invalid') ||
                error.message.includes('deactivated')
            ) {
                return res.status(401).json({
                    success: false,
                    message: error.message,
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to login',
            });
        }
    };
}

const authController = new AuthController();
export default authController;
