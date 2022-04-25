const express = require('express');
const router = express.Router();
require('dotenv').config();

// import controller
var LoginCtrl = require('../Controllers/LoginCtrl');
// var AdminCtrl = require('../controllers/AdminCtrl')
//var GetConfigCtrl =  require('../controllers/GetConfigCtrl');

//middleware
const signatureSigner = require('../middlewares/checkSignature').personalSignature;
var dataGuard;

if(process.env.APP != 'local')
{
    dataGuard = require('../middleware/decodeJWT').decodeMiddleware;
}
else
{
    dataGuard = (req, res, next) => {
        next()
    }
}

// Routes
router.post('/login',[signatureSigner, dataGuard], LoginCtrl.Login);

//admin login

module.exports = router;