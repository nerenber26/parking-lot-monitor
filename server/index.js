import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';

import * as db from './utils/connectDB.js';
import * as mqtt from './utils/connectMQTT.js';


const __dirname = dirname(fileURLToPath(import.meta.url));

const APP_ENV = process.env.APP_ENV || 'development';
const APP_PORT = process.env.APP_PORT || 3000;

const MQTT_BROKER_HOST = process.env.MQTT_BROKER_HOST || '127.0.0.1';
const MQTT_BROKER_PORT = process.env.MQTT_BROKER_PORT || 1883;
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'parking';

const POSTGRES_HOST = process.env.POSTGRES_HOST || '127.0.0.1';
const POSTGRES_PORT = process.env.POSTGRES_PORT || 5432;
const POSTGRES_DB = process.env.POSTGRES_DB || 'test';
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'password';
const POSTGRES_IDLE_TIMEOUT = process.env.POSTGRES_IDLE_TIMEOUT || 30000;
const POSTGRES_CONNECTION_TIMEOUT = process.env.POSTGRES_CONNECTION_TIMEOUT || 2000;
const POSTGRES_MAX_CONNECTIONS = process.env.POSTGRES_MAX_CONNECTIONS || 10;


const app = express();
app.set('view engine', 'pug');
app.use(express.static(join(__dirname, 'public')));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
});

const mqttClient = mqtt.connectClient(MQTT_BROKER_HOST, MQTT_BROKER_PORT);
mqtt.subscribeToTopic(mqttClient, MQTT_TOPIC);

const postgresPool = db.connectClient(
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_IDLE_TIMEOUT,
    POSTGRES_CONNECTION_TIMEOUT,
    POSTGRES_MAX_CONNECTIONS,
);


app.get('/', async(req, res) => {
    const info = await db.runQuery(postgresPool, `
        SELECT pl.name, pl.total_spaces, COUNT(ps.id) FILTER(WHERE ps.occupied = false) AS available_spaces
        FROM ParkingLots pl
        LEFT JOIN ParkingSpaces ps ON pl.id = ps.lot_id
        GROUP BY pl.id
        ORDER BY pl.name
    `);

    const results = info.rows.map(row => {
        return {
            name: row.name,
            available_spaces: parseInt(row.available_spaces, 10),
            total_spaces: parseInt(row.total_spaces, 10),
            icon: row.available_spaces / row.total_spaces > 0.50 ? '&#x1F7E9' :     // green
                    row.available_spaces / row.total_spaces > 0.25 ? '&#x1F7E8' :   // yellow
                    row.available_spaces / row.total_spaces > 0 ? '&#x1F7E7' :      // red
                    '&#x1F7E6' // black
        };
    });

    res.status(200).render('home', { results });
});

app.get('/map', (req, res) => {
    res.status(200).render('map');
});

app.get('/query', async(req, res) => {
    res.status(200).render('query');
});

app.all('*', (req, res) => {
    res.status(404).render('404');
});

app.listen(APP_PORT, () => {
    console.log(`Starting up server in ${APP_ENV.toUpperCase()} mode`);
    console.log(`ExpressJS App listening to port: ${APP_PORT}`);
});