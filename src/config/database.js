// config/database.js
let main = require('./main.js');

module.exports = {

    'url' : `mongodb://${main.host}:27020/unabase` // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot

};