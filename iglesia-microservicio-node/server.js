const express = require('express');
var cors = require('cors')

const db = require('./db');
const router = require('./network/routes');
const path = require('path');

db('mongodb+srv://db_user:Daylerpro123.@atlascluster.flvn531.mongodb.net/db_prueba?retryWrites=true&w=majority');


const app = express();
const server = require('http').Server(app);


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public/files'))); // Agrega el middleware de archivos estáticos
app.use(cors()) 
//app.use(router);
router(app);


app.use('/app', express.static('public'));


server.listen(83,'192.168.0.8', () => {
    console.log('SERVER --------> OK ON PORT 3000');
});
