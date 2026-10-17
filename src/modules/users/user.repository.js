import pool from '../../database/db.js';

export const createUserInDb = async ({ name, email, mobile_number, password, role }) => {
    const query = `
        INSERT INTO users (name, email, mobile_number, password, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, mobile_number, role, is_active, created_at, updated_at;
    `;
    const values = [name, email, mobile_number || null, password, role || 'CUSTOMER'];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const findUserByEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

export const findUserByMobile = async (mobile_number) => {
    const query = `SELECT * FROM users WHERE mobile_number = $1;`;
    const result = await pool.query(query, [mobile_number]);
    return result.rows[0];
};

export const findUserById = async (id) => {
    const query = `SELECT id, name, email, mobile_number, role, is_active, created_at, updated_at FROM users WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const getAllUsersFromDb = async ({ limit = 10, offset = 0, role, search }) => {
    let query = `SELECT id, name, email, mobile_number, role, is_active, created_at, updated_at FROM users WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) FROM users WHERE 1=1`;
    const values = [];
    let idx = 1;

    if (role) {
        query += ` AND role = $${idx}`;
        countQuery += ` AND role = $${idx}`;
        values.push(role);
        idx++;
    }

    if (search) {
        query += ` AND (name ILIKE $${idx} OR email ILIKE $${idx} OR mobile_number ILIKE $${idx})`;
        countQuery += ` AND (name ILIKE $${idx} OR email ILIKE $${idx} OR mobile_number ILIKE $${idx})`;
        values.push(`%${search}%`);
        idx++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
    const queryValues = [...values, limit, offset];

    const [usersResult, countResult] = await Promise.all([
        pool.query(query, queryValues),
        pool.query(countQuery, values),
    ]);

    return {
        users: usersResult.rows,
        total: parseInt(countResult.rows[0].count, 10),
    };
};

export const updateUserInDb = async (id, { name, mobile_number, role, is_active }) => {
    const updates = [];
    const values = [];
    let idx = 1;

    if (name !== undefined) {
        updates.push(`name = $${idx++}`);
        values.push(name);
    }
    if (mobile_number !== undefined) {
        updates.push(`mobile_number = $${idx++}`);
        values.push(mobile_number);
    }
    if (role !== undefined) {
        updates.push(`role = $${idx++}`);
        values.push(role);
    }
    if (is_active !== undefined) {
        updates.push(`is_active = $${idx++}`);
        values.push(is_active);
    }

    if (updates.length === 0) return null;

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = $${idx}
        RETURNING id, name, email, mobile_number, role, is_active, created_at, updated_at;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
};

export const deleteUserFromDb = async (id) => {
    const query = `DELETE FROM users WHERE id = $1 RETURNING id, name, email;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};
