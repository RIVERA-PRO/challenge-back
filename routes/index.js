import express from 'express'
import Posicion from '../models/posiciones.js'

const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/posiciones', async function (req, res, next) {
  const posiciones = await Posicion.find({});
  res.json(posiciones);
});

export default router;
