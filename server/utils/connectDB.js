import pg from 'pg';


const { Pool } = pg;
const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    idleTimeoutMillis: process.env.POSTGRES_IDLE_TIMEOUT,
    connectionTimeoutMillis: process.env.POSTGRES_CONNECTION_TIMEOUT,
    max: process.env.POSTGRES_MAX_CONNECTIONS,
});

pool.on('connect', () => {
    console.log('Database connected');
});


/**
 * Executes a SQL query against a database.
 *
 * @function runQuery
 * @param {string} text SQL query to be executed
 * @param {Array} params Array of parameters to use in the SQL query
 * @returns {Promise<Object>} Promise that resolves to the result of the query
 *
 * @example
 * const result = await runQuery('SELECT * FROM users WHERE id = $1', [userId]);
 * console.log(result.rows);
 */
export const runQuery = (text, params) => {
    return pool.query(text, params);
};

/**
 * Retrieves a database client from the connection pool, overriding its release methods.
 *
 * @function getClient
 * @returns {Promise<Object>} Promise that resolves to a database client
 *
 * @example
 * const client = await getClient()
 * const result = await client.query('SELECT * FROM users');
 * client.release()
 */
export const getClient = () => {
    return pool.connect();
};
