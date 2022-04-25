const objectives = require('../Objects/objectives');
const Joi = require('joi');
var CryptoJS = require('crypto-js');

const signatureSigner = time => {
    var sign = CryptoJS.enc.Utf8.parse(time);
    //var sign = time;
    var hash = CryptoJS.HmacSHA256(sign, process.env.SECRET);
    return hash.toString(CryptoJS.enc.Hex);
};

const signatureSignerMiddleware = (req, res, next) => {

    const hasValue = req.headers.hasOwnProperty("signatures");

    if(!hasValue)
    {
        return res.status(400).json(
            objectives.Error("Signatures header is required")
        );
    }

    var time1 = objectives.timestamp();
    var time2 = time1 + 1;

    var serverSignature1 = signatureSigner(time1);  //1
    var serverSignature2 = signatureSigner(time2);  //2
    var clientSignature = req.headers.signatures;   //3

    if(!(serverSignature1 != clientSignature ||  serverSignature2 != clientSignature ))
    {
        return res.status(400).json(
            objectives.Error("Request not signed")
        );
    }

    next();
}

module.exports = {signatureSignerMiddleware};