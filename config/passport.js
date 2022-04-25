var passport = require('passport');
var passportJWT = require('passport-jwt');
var JwtStrategy = passportJWT.Strategy;
var ExtractJwt = passportJWT.ExtractJwt;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

var LocalStrategy = require('passport-local').Strategy;
const db  = require('../Database/db');

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {

    var checkToken = await db.Oauth.findOne({ 
        where: {
            id: jwt_payload.id,
            // email: jwt_payload.email,
            iat: jwt_payload.iat,
            exp: jwt_payload.exp,
        }
    });
    
    if(!checkToken)
    {
        return done({
            message: "Unauthorized"
        });
    }

    await db.Admin.findOne({ where: {id: jwt_payload.id }})
    .then(user => {
        if(!user)
        {
            return done({
                message: "Unauthorized"
            });
        }

        return done(null, user)
    })
    .catch(err => {

        return done({
            message: "Unauthorized"
        });
    });
}));

passport.use(new LocalStrategy({
    usernameField: 'mobile'
}, async (email, password, done) => {

    console.log(000000)
    try
    {
        const user = await db.Admin.findOne({ where: {mobile: mobile }});
    
        if(!user)
        {
            return done({ message: 'Mobile is invalid'});
            //return done(null, false, "test");
        }

        return done(null, user);

    }
    catch(err)
    {
        return done({ message: 'Mobile is invalid'});
        //return done(null, false, { errors: { 'email or password': 'is invalid' } });
    }
    
}));