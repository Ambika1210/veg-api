import userService from './user.service.js';
import logger from '../../utils/logger.js';

class UserController {
    createCustomer = async (req, res) => {
        try {
            const user = await userService.registerUser({ ...req.body, role: 'CUSTOMER' });

            logger.info(`UserController >>>> createCustomer >>>> Customer ${user.id} created successfully`, {
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            return res.status(201).json({
                success: true,
                message: 'Customer created successfully',
                data: user,
            });
        } catch (error) {
            logger.error(`UserController >>>> createCustomer >>>> Failed to create customer: ${error.message}`, {
                error: error.message,
            });

            if (error.message.includes('already exists')) {
                return res.status(409).json({
                    success: false,
                    message: error.message,
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to create customer',
            });
        }
    };

    createAdmin = async (req, res) => {
        try {
            const user = await userService.registerUser({ ...req.body, role: 'ADMIN' });

            logger.info(`UserController >>>> createAdmin >>>> Admin ${user.id} created successfully`, {
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            return res.status(201).json({
                success: true,
                message: 'Admin created successfully',
                data: user,
            });
        } catch (error) {
            logger.error(`UserController >>>> createAdmin >>>> Failed to create admin: ${error.message}`, {
                error: error.message,
            });

            if (error.message.includes('already exists')) {
                return res.status(409).json({
                    success: false,
                    message: error.message,
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to create admin',
            });
        }
    };

    getAllUsers = async (req, res) => {
        try {
            const { page, limit, role, search } = req.query;
            const result = await userService.getAllUsers({ page, limit, role, search });

            logger.info(`UserController >>>> getAllUsers >>>> Fetched ${result.users.length} users successfully (Page: ${result.pagination.page}/${result.pagination.totalPages}, Total: ${result.pagination.total})`, {
                page: result.pagination.page,
                limit: result.pagination.limit,
                total: result.pagination.total,
            });

            return res.status(200).json({
                success: true,
                message: 'Users fetched successfully',
                data: result.users,
                pagination: result.pagination,
            });
        } catch (error) {
            logger.error(`UserController >>>> getAllUsers >>>> Failed to fetch users: ${error.message}`, {
                error: error.message,
            });

            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch users',
            });
        }
    };

    getUserById = async (req, res) => {
        const { id } = req.params;
        try {
            const user = await userService.getUserById(id);

            logger.info(`UserController >>>> getUserById >>>> User ${id} fetched successfully`, {
                userId: id,
            });

            return res.status(200).json({
                success: true,
                message: 'User fetched successfully',
                data: user,
            });
        } catch (error) {
            logger.error(`UserController >>>> getUserById >>>> Failed to fetch user ${id}: ${error.message}`, {
                userId: id,
                error: error.message,
            });

            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch user',
            });
        }
    };

    updateUser = async (req, res) => {
        const { id } = req.params;
        try {
            const updatedUser = await userService.updateUser(id, req.body);

            logger.info(`UserController >>>> updateUser >>>> User ${id} updated successfully`, {
                userId: id,
            });

            return res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: updatedUser,
            });
        } catch (error) {
            logger.error(`UserController >>>> updateUser >>>> Failed to update user ${id}: ${error.message}`, {
                userId: id,
                error: error.message,
            });

            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }

            if (error.message.includes('already exists')) {
                return res.status(409).json({
                    success: false,
                    message: error.message,
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to update user',
            });
        }
    };

    deleteUser = async (req, res) => {
        const { id } = req.params;
        try {
            const deletedUser = await userService.deleteUser(id);

            logger.info(`UserController >>>> deleteUser >>>> User ${id} deleted successfully`, {
                userId: id,
            });

            return res.status(200).json({
                success: true,
                message: 'User deleted successfully',
                data: deletedUser,
            });
        } catch (error) {
            logger.error(`UserController >>>> deleteUser >>>> Failed to delete user ${id}: ${error.message}`, {
                userId: id,
                error: error.message,
            });

            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to delete user',
            });
        }
    };
}

const userController = new UserController();
export default userController;
