import pool from '../../database/db.js';

export const findUserForAuth = async ({ email, mobile_number }) => {
    const query = `
        SELECT id, name, email, mobile_number, password, role, is_active, created_at, updated_at
        FROM users
        WHERE ($1::text IS NOT NULL AND email = $1)
           OR ($2::text IS NOT NULL AND mobile_number = $2);
    `;
    const result = await pool.query(query, [email || null, mobile_number || null]);
    return result.rows[0];
};
