const express = require('express');
const response = require('../../network/response');
const controller = require('./controller');
const multer = require('multer');
const router = express.Router();
const AWS = require('aws-sdk');
const e = require('express');
AWS.config.update({
    accessKeyId: 'AKIA43GFLFLWQXNAUJSD',
    secretAccessKey: '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',
    region: 'us-east-1', // Reemplaza con tu región AWS
});
router.get('/:idSermon', (req, res) => {
    const idSermon = req.params.idSermon;
    controller.getUsers(idSermon)
        .then( (data) => {
            response.succes(req, res, data, 200);
        })
        .catch( (err) => {
            response.error(req, res, 'Internal Error', 500, err);
        })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    controller.deleteSermon(id)
        .then( () => {
            response.succes(req, res, `Usuario ${id} Eliminado`, 200)
        })
        .catch( (err) => {
            response.error(req, res, 'Error Interno eliminando usuario', 500, err);
        })
});
router.post('/', (req, res) => {
    const descripcion = req.body.descripcion; 
    const idSermon = req.body.idSermon; 
    const comprehend = new AWS.Comprehend();
    let valor = '0';
    let sentimiento = '';

    const params = {
        LanguageCode: 'es', // Establece el código de idioma según tu texto
        Text: descripcion,
    };
    comprehend.detectSentiment(params, (err, data) => {
        if (err) {
            console.error('Error al analizar el sentimiento:', err);
        } else {
            sentimiento = data.Sentiment;
            console.log(`Sentimiento: ${data.Sentiment}`);
            if(data.Sentiment == 'NEGATIVE'){
                controller.addUser(descripcion,idSermon,'1','NEGATIVE')
                .then( (data) => {
                    response.succes(req, res, data, 201);
                })
                .catch( (err) => {
                    response.error(req, res, 'Internal Error', 500, err)
                })
            }else if(data.Sentiment == 'NEUTRAL'){
                controller.addUser(descripcion,idSermon,'3','NEUTRAL')
                .then( (data) => {
                    response.succes(req, res, data, 201);
                })
                .catch( (err) => {
                    response.error(req, res, 'Internal Error', 500, err)
                })
            }else if(data.Sentiment == 'POSITIVE'){
                controller.addUser(descripcion,idSermon,'5','POSITIVE')
                .then( (data) => {
                    response.succes(req, res, data, 201);
                })
                .catch( (err) => {
                    response.error(req, res, 'Internal Error', 500, err)
                })
            }
        }
    });
});
module.exports = router;