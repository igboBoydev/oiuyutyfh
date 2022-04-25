const objectives = require('../Objects/objectives');

const authMiddleware = (req,res,next) => {

    if(parseInt(req.user.locked) == 1)
    {
        return res.status(400).json(
            objectives.Error("Your account has been locked temporarily. Kindly contact admin!")
          );
    }

    next();
    
}

module.exports = {authMiddleware};