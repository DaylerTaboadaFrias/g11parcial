const Model = require('./model');

function getUser() {
    const users = Model.find();
    return users;
}
function getUserLogin(email) {
    const users = Model.findOne({ name: email });
    return users;
}
function addUser(user) {
    const myUser = new Model(user);
    return myUser.save();
}

function removeSermon(id) {
    return Model.deleteOne(
        {
            _id: id
        }
    );
}

module.exports = {
    getUser, 
    addUser,
    getUserLogin,
    removeSermon
}