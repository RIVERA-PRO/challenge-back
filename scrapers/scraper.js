import cheerio from 'cheerio';
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Posiciones from '../models/posiciones.js';

dotenv.config();

// URL del sitio web a scrapear
const url = 'https://www.futbolargentino.com/primera-division/tabla-de-posiciones';

// Función para obtener los datos de la tabla de posiciones
export async function getPosiciones() {
    try {
        const response = await axios.get(url);
        console.log(response.data);

        const $ = cheerio.load(response.data);
        const table = $('.table-sm.mb-0.table tbody tr').toArray();
        const posiciones = [];

        table.forEach((row) => {
            const posicion = Number($(row).find('.bg-color:first').text().trim());
            const equipo = $(row).find('.equipo').find('span:first').text().trim();
            const puntos = Number($(row).find('.bg-color:eq(2)').text().trim());
            const partidos_jugados = Number($(row).find('.bg-color:eq(1)').text().trim());
            const partidos_ganados = Number($(row).find('.d-none.d-md-table-cell:eq(0)').text().trim());
            const partidos_empatados = Number($(row).find('.d-none.d-md-table-cell:eq(1)').text().trim());
            const partidos_perdidos = Number($(row).find('.d-none.d-md-table-cell:eq(2)').text().trim());
            const goles_a_favor = Number($(row).find('.d-none.d-md-table-cell:eq(3)').text().trim());
            const goles_en_contra = Number($(row).find('.d-none.d-md-table-cell:eq(4)').text().trim());
            // const diferencia_goles = Number($(row).find('.bg-color:eq(1)').text().trim());
            const escudo_url = $(row).find('.equipo img').attr('data-src');
            const diferencia_goles = goles_a_favor - goles_en_contra;

            posiciones.push({
                posicion,
                equipo,
                puntos,
                partidos_jugados,
                partidos_ganados,
                partidos_empatados,
                partidos_perdidos,
                goles_a_favor,
                goles_en_contra,
                diferencia_goles,
                escudo_url,
            });
            console.log(posicion, equipo, puntos);
            console.log(posiciones)
        });

        return posiciones;
    } catch (error) {
        console.error(error);
        return null;
    }

}

// Conectamos a la base de datos
mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

// Creamos una función para guardar las posiciones en la base de datos
export async function savePosiciones() {
    const posiciones = await getPosiciones();
    console.log(posiciones)
    if (posiciones) {
        await Posiciones.deleteMany();
        await Posiciones.insertMany(posiciones);
        console.log(`${posiciones.length} posiciones insertadas en la base de datos`);

        console.log('Posiciones guardadas en la base de datos');
        const allPosiciones = await Posiciones.find();
        console.log('Posiciones en la base de datos:', allPosiciones);
        console.error()
    }
}
