const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mySchema = new Schema(
    {
        descripcion: String,
        idSermon: String,
        valor: String,
        sentimiento: String
    }
);
const model = mongoose.model('Comentario', mySchema);
module.exports = model;