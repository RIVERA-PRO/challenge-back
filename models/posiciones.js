import mongoose from 'mongoose';

// Definimos el esquema de la tabla de posiciones
const posicionesSchema = new mongoose.Schema({
    posicion: Number,
    equipo: String,
    puntos: Number,
    partidos_jugados: Number,
    partidos_ganados: Number,
    partidos_empatados: Number,
    partidos_perdidos: Number,
    goles_a_favor: Number,
    goles_en_contra: Number,
    diferencia_goles: Number,
    escudo_url: String,
});

// Definimos el modelo de la tabla de posiciones
const Posiciones = mongoose.model('Posiciones', posicionesSchema);

export default Posiciones;
