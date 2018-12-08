const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var usersAndRole = new Schema({
    roleName: {type: String, unique: true},
    userID: {type: String}, //TODO: add ref to users
    children: [{type: Schema.Types.ObjectId, ref: 'UsersAndRole'}]
});

module.exports = mongoose.model('UsersAndRoles', usersAndRole);