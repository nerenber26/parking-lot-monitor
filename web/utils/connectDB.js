import pg from 'pg'


const { Pool } = pg

// TODO: Delete before production
const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_PORT = process.env.POSTGRES_PORT;
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE;

const pool = new Pool({
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DATABASE,
});

export const runQuery = async(text, params) => {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('executed query', { text, duration, rows: res.rowCount })
    return res
}

export const getClient = async() => {
    const client = await pool.connect()

    const query = client.query
    const release = client.release

    const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!')
        console.error(`The last executed query on this client was: ${client.lastQuery}`)
    }, 5000)

    client.query = (...args) => {
        client.lastQuery = args
        return query.apply(client, args)
    }

    client.release = () => {
        clearTimeout(timeout)
        client.query = query
        client.release = release
        return release.apply(client)
    }

    return client
}
