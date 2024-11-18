import pg from 'pg';


/**
 * Connects to a PostgreSQL database using a connection pool and sets up event listeners for connection and errors.
 *
 * @param {string} POSTGRES_HOST host URL or IP address of the PostgreSQL server.
 * @param {number} POSTGRES_PORT port number on which the PostgreSQL server is running (default is 5432).
 * @param {string} POSTGRES_DB name of the database to connect to.
 * @param {string} POSTGRES_USER username for authenticating to the PostgreSQL server.
 * @param {string} POSTGRES_PASSWORD password for authenticating the PostgreSQL user.
 * @param {number} POSTGRES_IDLE_TIMEOUT number of milliseconds before an idle connection is closed.
 * @param {number} POSTGRES_CONNECTION_TIMEOUT number of milliseconds to wait before timing out a connection attempt.
 * @param {number} POSTGRES_MAX_CONNECTIONS maximum number of connections in the pool.
 * 
 * @returns {Pool} PostgreSQL connection pool instance.
 * 
 * @example
 * const pool = connectClient('localhost', 5432, 'user', 'password', 'mydb', 10, 30000, 2000);
 */
export const connectClient = (
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_IDLE_TIMEOUT,
    POSTGRES_CONNECTION_TIMEOUT,
    POSTGRES_MAX_CONNECTIONS,
) => {
    const { Pool } = pg;
    const pool = new Pool({
        host: POSTGRES_HOST,
        port: POSTGRES_PORT,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        idleTimeoutMillis: POSTGRES_IDLE_TIMEOUT,
        connectionTimeoutMillis: POSTGRES_CONNECTION_TIMEOUT,
        max: POSTGRES_MAX_CONNECTIONS,
    });

    pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
    });

    pool.on('connect', () => {
        console.log('Database connected');
    });

    return pool;
};

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
export const runQuery = (pool, text, params) => {
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
export const getClient = (pool) => {
    return pool.connect();
};
