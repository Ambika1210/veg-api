import pool from '../../database/db.js';

export const createProductInDb = async ({ name, image, price }) => {
    const query = `
        INSERT INTO products (name, image, price)
        VALUES ($1, $2, $3)
        RETURNING id, name, image, price, is_available, created_at, updated_at;
    `;
    const values = [name, image || null, price];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getProductByIdFromDb = async (id) => {
    const query = `
        SELECT id, name, image, price, is_available, created_at, updated_at
        FROM products
        WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const getAllProductsFromDb = async ({ limit = 10, offset = 0, search }) => {
    let query = `SELECT id, name, image, price, is_available, created_at, updated_at FROM products WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) FROM products WHERE 1=1`;
    const values = [];
    let idx = 1;

    if (search) {
        query += ` AND name ILIKE $${idx}`;
        countQuery += ` AND name ILIKE $${idx}`;
        values.push(`%${search}%`);
        idx++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
    const queryValues = [...values, limit, offset];

    const [productsResult, countResult] = await Promise.all([
        pool.query(query, queryValues),
        pool.query(countQuery, values),
    ]);

    return {
        products: productsResult.rows,
        total: parseInt(countResult.rows[0].count, 10),
    };
};
