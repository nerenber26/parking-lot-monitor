import pg from 'pg';


const { Pool } = pg;

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DATABASE,
    POSTGRES_MAX_CONNECTIONS,
} = process.env;

const pool = new Pool({
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DATABASE,
    max: POSTGRES_MAX_CONNECTIONS,
    idleTimeoutMillis: 30 * 1000,
    connectionTimeoutMillis: 2 * 1000,
});

/**
 * Executes a SQL query against a database.
 *
 * @async
 * @function runQuery
 * @param {string} text - SQL query to be executed
 * @param {Array} params - Array of parameters to use in the SQL query
 * @returns {Promise<Object>} - Promise that resolves to the result of the query
 *
 * @example
 * const result = await runQuery('SELECT * FROM users WHERE id = $1', [userId]);
 * console.log(result.rows);
 */
export const runQuery = async(text, params) => {
    return pool.query(text, params);
};

/**
 * Retrieves a database client from the connection pool, overriding its release methods.
 *
 * @async
 * @function getClient
 * @returns {Promise<Object>} Promise that resolves to a database client
 *
 * @example
 * const client = await getClient()
 * const result = await client.query('SELECT * FROM users');
 * client.release()
 */
export const getClient = async () => {
    return pool.connect();
};
