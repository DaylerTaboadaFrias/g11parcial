const store = require('./store');
function getUsers() {
    return store.getUser();
}
function getUserLogin(email) {
    return store.getUserLogin(email);
}
function addUser(name,file) {
    if(!name){
        return Promise.reject('Invalid name en controller');
    }
    let fileUrl = file ? 'https://iglesia-node.uw.r.appspot.com/' + file.originalname : ""

    const user = {
        name,
        file: fileUrl
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