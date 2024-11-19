import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';

import './utils/connectDB.js';
import  './utils/connectMQTT.js';

import errorHandler from './middlewares/errorHandler.js';

import apiRouter from './routes/api.js';
import pagesRouter from './routes/pages.js';


const __dirname = dirname(fileURLToPath(import.meta.url));

const APP_ENV = process.env.APP_ENV || 'development';
const APP_PORT = process.env.APP_PORT || 3000;


const app = express();

app.set('view engine', 'pug');

app.use(express.static(join(__dirname, 'public')));
app.use(express.json());
app.use(errorHandler);

app.get('/favicon.ico', (req, res) => {
    res.sendFile('public/favicon.ico', { root: __dirname } )
});

app.use('/', pagesRouter);
app.use('/api', apiRouter);

app.all('*', (req, res) => {
    res.status(404).render('404');
});

app.listen(APP_PORT, () => {
    console.log(`Starting up server in ${APP_ENV.toUpperCase()} mode`);
    console.log(`ExpressJS App listening to port: ${APP_PORT}`);
});