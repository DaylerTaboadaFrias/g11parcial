const express = require('express');
const response = require('../../network/response');
const controller = require('./controller');
const multer = require('multer');
const router = express.Router();
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/files/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })
router.get('/', (req, res) => {
    controller.getUsers()
        .then( (data) => {
            response.succes(req, res, data, 200);
        })
        .catch( (err) => {
            response.error(req, res, 'Internal Error', 500, err);
        })
})
router.get('/login/:email', (req, res) => {
    const email = req.params.email;
    controller.getUserLogin(email)
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

router.post('/', upload.single('file'), (req, res) => {
    const name = req.body.name; 
    controller.addUser(name, req.file)
        .then( (data) => {
            response.succes(req, res, data, 201);
        })
        .catch( (err) => {
            response.error(req, res, 'Internal Error', 500, err)
        })
});
module.exports = router;