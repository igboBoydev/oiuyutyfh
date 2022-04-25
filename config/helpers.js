const db  = require('../database/db');
const axios = require('axios');
const jwt_decode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const moment = require('moment');
require('dotenv').config();

const sendError = message => {
    var error = {
        "error": {
            "status": "ERROR",
            "code": "01",
            "message": message
        }
    }

    return error;
}

const sendSuccess = (message, data = undefined) => {
    var success = {
        "success": {
            "status": "SUCCESS",
            "message": message,
            "data": data
        }
    }

    return success;
}

const checkUserPhone = async function checkUserMobile(req) {
    return await db.Admin.findOne({ 
        where: {
        mobile: req.body.phoneNumber }
    });
}

const checkUserEmail = async function createUserMail(req) {
    return await db.Admin.findOne({ 
        where: {
        email: req.body.email }
    });
}

const logAdmin = async function logger(email, description, data) {
    
    await db.AdminLog.create({
        email: email,
        description: description,
        data: JSON.stringify(data)
    });

    return;
}

function generateClientId(length)
{
   var result           = '';
   var characters       = '123456789123456789123456789';
   var charactersLength = characters.length;

   for ( var i = 0; i < length; i++ ) 
   {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }

   return result;
}



module.exports = {
    sendError,
    sendSuccess,
    checkUserEmail, 
    logAdmin,
    generateClientId,
    checkUserPhone, 
};