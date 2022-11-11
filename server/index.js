const express = require("express") ;
const cors = require( 'cors');
const root = require('../Routes');
const errorResponseManager = require("../utils/errorResponseManager");
require("../database/connection");

const server = express();
server.use(cors());

server.use(express.urlencoded({ extended: true}));
server.use(express.json());

server.use('/api',root);
server.use(errorResponseManager);
server.use((req, res, next)=>res.status(404).json({isError:true,message:"Route Not Found, or peticion not acepted on this Route"}));

server.get('/', (req, res) => {
    res.redirect('/api');
});

module.exports = server;