import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';


const APP_PORT = process.env.APP_PORT || 3000;
const APP_ENV = process.env.APP_ENV || 'development';
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.set('view engine', 'pug');
app.use(express.static(join(__dirname, 'public')));

app.get('/', async(req, res) => {
    const infoArray = [
        'Main Lot: 50/100 Available &#x1F7E9', 
        'Commons Lot: 5/40 Available &#x1F7E5', 
        'Waldschmidt Lot: 10/30 Available &#x1F7E8',
        'Shiley Lot: 10/20 Available &#x1F7E9',
        'Christie Lot: 5/20 Available &#x1F7E5',
        'Kenna Lot: 1/20 Available &#x1F7E5',
        'Portsmouth Lot: 2/20 Available &#x1F7E5',
        ]
    console.log(infoArray)
    res.status(200).render('home', { infoArray });
});

app.get('/map', async(req, res) => {
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
