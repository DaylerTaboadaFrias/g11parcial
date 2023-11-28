const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mySchema = new Schema(
    {
        name: String,
        
        file: String,
    }
);
const model = mongoose.model('Sermon', mySchema);
module.exports = model;