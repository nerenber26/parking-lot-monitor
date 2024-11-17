import pg from 'pg';


const { Pool } = pg;

const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
const POSTGRES_PORT = process.env.POSTGRES_PORT || 5432;
const POSTGRES_MAX_CONNECTIONS = process.env.POSTGRES_MAX_CONNECTIONS || 20;
const POSTGRES_IDLE_TIMEOUT = process.env.POSTGRES_IDLE_TIMEOUT || 30000;
const POSTGRES_CONNECTION_TIMEOUT = process.env.POSTGRES_CONNECTION_TIMEOUT || 2000;

const POSTGRES_USER = process.env.POSTGRES_USER || console.error('POSTGRES_USER is not set') && process.exit(1);
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || console.error('POSTGRES_PASSWORD is not set') && process.exit(1);
const POSTGRES_DATABASE = process.env.POSTGRES_DB || console.error('POSTGRES_DATABASE is not set') && process.exit(1);

const pool = new Pool({
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DATABASE,
    max: POSTGRES_MAX_CONNECTIONS,
    idleTimeoutMillis: POSTGRES_IDLE_TIMEOUT,
    connectionTimeoutMillis: POSTGRES_CONNECTION_TIMEOUT,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
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
