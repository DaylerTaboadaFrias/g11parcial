const db = require('mongoose');

db.Promise = global.Promise;

async function connect(URL) {
    //mongodb+srv://admin:admin@clustercursodenode.mjbgkeh.mongodb.net/?retryWrites=true&w=majority
    await db.connect(URL,
    {
        useNewUrlParser: true
    });
}

module.exports = connect;

