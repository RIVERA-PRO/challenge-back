import express from 'express';
import 'dotenv/config';
import './config/database.js';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import { __dirname } from './utils.js';
import cors from 'cors';
import { errorHandler, errorNotFound } from './middlewares/error.js';
import Posiciones from './models/posiciones.js';
import { savePosiciones } from './scrapers/scraper.js'

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Llamamos a la función savePosiciones() en la ruta /posiciones
app.get('/posiciones', async (req, res) => {
    try {
        await savePosiciones();
        const posiciones = await Posiciones.find();
        res.json(posiciones);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las posiciones');
    }
});

app.use('/', indexRouter);

app.use(errorNotFound);
app.use(errorHandler);

export default app;
