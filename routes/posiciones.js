import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import Posiciones from '../models/posiciones.js';

router.get('/', async (req, res) => {
    try {
        const posiciones = await Posiciones.find();
        res.json(posiciones);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las posiciones');
    }
});

export default router;
