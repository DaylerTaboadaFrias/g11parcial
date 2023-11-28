const store = require('./store');
function getUsers(idSermon) {
    return store.getUser(idSermon);
}
function getUserLogin(email) {
    return store.getUserLogin(email);
}
function addUser(descripcion,idSermon,valor,sentimiento) {
    if(!descripcion){
        return Promise.reject('Invalid name en controller');
    }
    const user = {
        descripcion,
        idSermon: idSermon,
        valor : valor,
        sentimiento : sentimiento
    }
    return store.addUser(user);
}
function deleteSermon(id) {
    return new Promise( (resolve, reject) => {
        if( !id ){
            reject('Id invalid');
        }

        store.removeSermon(id)
            .then( () => {
                resolve();
            })
            .catch( (err) => {
                reject(err);
            })
    });
}
module.exports = {
    addUser,
    getUsers,
    getUserLogin,
    deleteSermon
}