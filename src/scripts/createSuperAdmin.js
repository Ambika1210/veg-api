import pool from '../database/db.js';
import logger from '../utils/logger.js';
import chalk from '../utils/chalk.js';

const createSuperAdmin = async () => {
    const name = process.env.SUPERADMIN_NAME || 'Super Admin';
    const email = (process.env.SUPERADMIN_EMAIL || 'superadmin@veggies.com').toLowerCase().trim();
    const password = process.env.SUPERADMIN_PASSWORD || 'SuperAdmin@123';
    const mobile_number = process.env.SUPERADMIN_MOBILE || '9999999999';

    try {
        console.log(chalk.getReq('========================================'));
        console.log(chalk.getReq('    CREATING SUPERADMIN ACCOUNT         '));
        console.log(chalk.getReq('========================================'));

        // 1. Ensure SUPERADMIN enum value and is_active column exist
        await pool.query("ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'SUPERADMIN';");
        await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;");

        // 2. Check if user with email already exists
        const checkQuery = 'SELECT id, email, role FROM users WHERE email = $1;';
        const checkResult = await pool.query(checkQuery, [email]);

        let superAdmin;

        if (checkResult.rows.length > 0) {
            // User exists: Update role to SUPERADMIN
            const updateQuery = `
                UPDATE users
                SET role = 'SUPERADMIN', is_active = true, updated_at = CURRENT_TIMESTAMP
                WHERE email = $1
                RETURNING id, name, email, mobile_number, role, is_active, created_at;
            `;
            const updateResult = await pool.query(updateQuery, [email]);
            superAdmin = updateResult.rows[0];

            logger.info(`createSuperAdmin >>>> Existing user ${superAdmin.id} promoted to SUPERADMIN`, {
                userId: superAdmin.id,
                email: superAdmin.email,
            });
            console.log(chalk.success(`✔ Existing user promoted to SUPERADMIN successfully!`));
        } else {
            // User does not exist: Insert new SUPERADMIN
            const insertQuery = `
                INSERT INTO users (name, email, mobile_number, password, role, is_active)
                VALUES ($1, $2, $3, $4, 'SUPERADMIN', true)
                RETURNING id, name, email, mobile_number, role, is_active, created_at;
            `;
            const insertResult = await pool.query(insertQuery, [name, email, mobile_number, password]);
            superAdmin = insertResult.rows[0];

            logger.info(`createSuperAdmin >>>> New SUPERADMIN ${superAdmin.id} created successfully`, {
                userId: superAdmin.id,
                email: superAdmin.email,
            });
            console.log(chalk.success(`✔ New SUPERADMIN created successfully!`));
        }

        console.log(chalk.postReq('----------------------------------------'));
        console.log(chalk.postReq('SUPERADMIN CREDENTIALS:'));
        console.log(`Email    : ${chalk.success(email)}`);
        console.log(`Password : ${chalk.success(password)}`);
        console.log(`Role     : ${chalk.success(superAdmin.role)}`);
        console.log(`User ID  : ${chalk.success(superAdmin.id)}`);
        console.log(chalk.postReq('----------------------------------------'));

        process.exit(0);
    } catch (error) {
        logger.error(`createSuperAdmin >>>> Failed to create superadmin: ${error.message}`, {
            error: error.message,
            stack: error.stack,
        });
        console.error(chalk.error(`✖ Failed to create superadmin: ${error.message}`));
        process.exit(1);
    }
};

createSuperAdmin();
