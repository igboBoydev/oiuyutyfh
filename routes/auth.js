const express = require('express');
const router = express.Router();
const passport = require('passport')
require('../config/passport')
require('dotenv').config();

// import controller
var AdminCtrl =  require('../controllers/AdminCtrl');
// var ApplicationCtrl = require('../controllers/ApplicationCtrl');
// var AdminCtrl = require('../controllers/AdminCtrl');

//middleware
var jwtMiddleWare = passport.authenticate('jwt', {session: false});
const signatureSigner = require('../middlewares/checkSignature').personalSignature;
var dataGuard;

if(process.env.APP != 'local')
{
    dataGuard = require('../middleware/decodeJWT').decodeMiddleware;
}
else
{
    dataGuard = (req, res, next) => {
        next();
    }
}

// Routes
router.post('/create-admin', [jwtMiddleWare, signatureSigner], AdminCtrl.create); 
router.get('/single-admin', [jwtMiddleWare, signatureSigner], AdminCtrl.adminId);
router.get('/delete-admin', [jwtMiddleWare, signatureSigner], AdminCtrl.delete);
router.post('/update-admin', [jwtMiddleWare, signatureSigner], AdminCtrl.update);
router.get('/all-admins', [jwtMiddleWare, signatureSigner], AdminCtrl.allAdmins);
router.post('/change-password', [jwtMiddleWare, signatureSigner], AdminCtrl.changePassword);
router.get('/emerging-wealth/all-users', [jwtMiddleWare, signatureSigner], AdminCtrl.allUsers);
router.get('/emerging-wealth/all-corperate', [jwtMiddleWare, signatureSigner], AdminCtrl.AllCorperate);
router.post('/emerging-wealth/single-corperate', [jwtMiddleWare, signatureSigner], AdminCtrl.singleCorperate);
router.get('/emerging-wealth/all-market-news-updates', [jwtMiddleWare, signatureSigner], AdminCtrl.AllMarketUpdates);
router.post('/emerging-wealth/create-market-news-update', [jwtMiddleWare, signatureSigner], AdminCtrl.createMarketUpdate);
router.post('/emerging-wealth/edit-market-news-update', [jwtMiddleWare, signatureSigner], AdminCtrl.editMarketUpdate);
router.get('/emerging-wealth/delete-market-updates', [jwtMiddleWare, signatureSigner], AdminCtrl.deleteMarketUpdate);
router.post('/emerging-wealth/single-user', [jwtMiddleWare, signatureSigner], AdminCtrl.singleUser);
router.get('/emerging-wealth/all-directors', [jwtMiddleWare, signatureSigner], AdminCtrl.AllDirectors);
router.post('/emerging-wealth/single-director', [jwtMiddleWare, signatureSigner], AdminCtrl.singleDirector);
router.get('/emerging-wealth/all-investments', [jwtMiddleWare, signatureSigner], AdminCtrl.AllInvestmentWallet);
router.post('/emerging-wealth/single-investment', [jwtMiddleWare, signatureSigner], AdminCtrl.singleInvestment);
router.get('/emerging-wealth/all-next-of-kin', [jwtMiddleWare, signatureSigner], AdminCtrl.allNextOfKin);
router.post('/emerging-wealth/single-next-of-kin', [jwtMiddleWare, signatureSigner], AdminCtrl.singleNextOfKin);

module.exports = router;