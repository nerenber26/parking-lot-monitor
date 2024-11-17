import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';

import * as db from './utils/connectDB.js';
import * as mqtt from './utils/connectMQTT.js';


const APP_PORT = process.env.APP_PORT || 3000;
const APP_ENV = process.env.APP_ENV || 'development';
const __dirname = dirname(fileURLToPath(import.meta.url));

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


app.get('/', async(req, res) => {
    const info = await db.runQuery(`
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

app.get('/api', async(req, res) => {
    const results = await db.runQuery('SELECT pl.name, COUNT(ps.id), pl.total_spaces FROM ParkingLots pl JOIN ParkingSpaces ps ON pl.id = ps.lot_id WHERE ps.occupied = false GROUP BY pl.name, pl.total_spaces', []);
    res.status(200).send(results.rows);
})

app.all('*', (req, res) => {
    res.status(404).render('404');
});

app.listen(APP_PORT, () => {
    console.log(`Starting up server in ${APP_ENV.toUpperCase()} mode`);
    console.log(`ExpressJS App listening to port: ${APP_PORT}`);

    mqtt.subscribeToTopic('parking');
});