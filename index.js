import path from 'path';
import express from "express";
import logger from 'morgan';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(process.cwd(), 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(process.cwd(), 'views'));

app.use(logger((tokens, req, res) => {
    const status = tokens.status(req, res);
    const statusColor = status >= 500 ? '\x1b[31m' :
                        status >= 400 ? '\x1b[33m' :
                        status >= 300 ? '\x1b[36m' :
                        '\x1b[32m';

    const resetColor = '\x1b[0m';

    return [
        tokens.method(req, res).padEnd(7),
        tokens.url(req, res).padEnd(30),
        `${statusColor}${status}${resetColor}`,
        `${tokens.res(req, res, 'content-length') || 0} bytes`,
        `- ${tokens['response-time'](req, res)} ms`
    ].join(' ');
}));

app.use((err, req, res, next) => {
    console.error(`Error occurred: ${err.message}`);
    console.error(`Request Method: ${req.method}, Request URL: ${req.originalUrl}`);
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

app.get("/", (req, res) => {
    res.status(200).render('index', { title: "Index" });
});

// catch-all for undefined routes
app.all('*', (req, res) => {
    res.status(404).json({"status": 404});
});


const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
    console.log(`Starting up server in ${NODE_ENV.toUpperCase()} mode`);
    console.log(`ExpressJS App listening to port: ${PORT}`);
});

const shutdown = (signal) => {
    console.log(`\nReceived ${signal}. Closing HTTP server...`);
    server.close((err) => {
        if (err) {
            console.error("Error during shutdown:", err);
            process.exit(1);
        }
        console.log("HTTP server closed. Exiting process.");
        process.exit(0);
    });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
