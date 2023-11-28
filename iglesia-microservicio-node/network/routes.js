const sermon = require('../components/sermon/network');
const comentario = require('../components/comentario/network');

function routes (server) {
    server.use('/sermon', sermon);
    server.use('/comentario', comentario);
}

module.exports = routes;