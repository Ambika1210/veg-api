import {
    createUserInDb,
    findUserByEmail,
    findUserByMobile,
    findUserById,
    getAllUsersFromDb,
    updateUserInDb,
    deleteUserFromDb,
} from './user.repository.js';
import logger from '../../utils/logger.js';

class UserService {
    registerUser = async (userData) => {
        try {
            const { name, email, mobile_number, password, role } = userData;

            if (!name || !email || !password) {
                throw new Error('Name, email, and password are required');
            }

            const existingEmail = await findUserByEmail(email);
            if (existingEmail) {
                throw new Error('User with this email already exists');
            }

            if (mobile_number) {
                const existingMobile = await findUserByMobile(mobile_number);
                if (existingMobile) {
                    throw new Error('User with this mobile number already exists');
                }
            }

            const newUser = await createUserInDb({
                name,
                email,
                mobile_number,
                password,
                role: role || 'CUSTOMER',
            });

            return newUser;
        } catch (error) {
            logger.error(`UserService >>>> registerUser >>>> Error: ${error.message}`, { error: error.message });
            throw error;
        }
    };

    getAllUsers = async ({ page = 1, limit = 10, role, search }) => {
        try {
            const pageNum = Math.max(1, parseInt(page, 10) || 1);
            const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
            const offset = (pageNum - 1) * limitNum;

            const { users, total } = await getAllUsersFromDb({
                limit: limitNum,
                offset,
                role,
                search,
            });

            const totalPages = Math.ceil(total / limitNum);

            return {
                users,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages,
                    hasNextPage: pageNum < totalPages,
                    hasPrevPage: pageNum > 1,
                },
            };
        } catch (error) {
            logger.error(`UserService >>>> getAllUsers >>>> Error: ${error.message}`, { error: error.message });
            throw error;
        }
    };

    getUserById = async (id) => {
        try {
            const user = await findUserById(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            logger.error(`UserService >>>> getUserById >>>> Error: ${error.message}`, { id, error: error.message });
            throw error;
        }
    };

    updateUser = async (id, updateData) => {
        try {
            const existingUser = await findUserById(id);
            if (!existingUser) {
                throw new Error('User not found');
            }

            if (updateData.mobile_number && updateData.mobile_number !== existingUser.mobile_number) {
                const existingMobile = await findUserByMobile(updateData.mobile_number);
                if (existingMobile && existingMobile.id !== id) {
                    throw new Error('User with this mobile number already exists');
                }
            }

            const updatedUser = await updateUserInDb(id, updateData);
            return updatedUser;
        } catch (error) {
            logger.error(`UserService >>>> updateUser >>>> Error: ${error.message}`, { id, error: error.message });
            throw error;
        }
    };

    deleteUser = async (id) => {
        try {
            const existingUser = await findUserById(id);
            if (!existingUser) {
                throw new Error('User not found');
            }

            const deletedUser = await deleteUserFromDb(id);
            return deletedUser;
        } catch (error) {
            logger.error(`UserService >>>> deleteUser >>>> Error: ${error.message}`, { id, error: error.message });
            throw error;
        }
    };
}

const userService = new UserService();
export default userService;
