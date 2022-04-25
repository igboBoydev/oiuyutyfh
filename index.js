const app = require('express')();

const session = require('express-session')

const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const cookieParser = require('cookie-parser');
// const objectives = require('./Objects/objectives');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const helmet = require('helmet');




//Load Environment Variables
require('dotenv').config();
//Connect to DataBase
// require('./database/mysqlDb');

//Cross origin fix
app.use(cors());
// set security HTTP headers
app.use(helmet());

//session
const oneDay = 1000 * 60 * 60 * 24;
app.use(cookieParser())
app.use(session({ secret: process.env.SECRET, resave: true, saveUninitialized: false, cookie: { maxAge: 600000 } }));

// Logger
// create a write stream (in append mode)
//var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });


// setup the logger
// app.use(morgan('combined', { stream: accessLogStream }));

//Parses requests body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Initialise Passport
app.use(passport.initialize());
//app.use(passport.session());

//Configure socket global
app.use(function (req, res, next){
    req.io = io;
    next();
});


//Cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if(req.method == "OPTIONS")
    {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, PATCH, GET');
        return res.status(200).json({});
    }

    next();
})


const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');


// App Routes
app.use('/emerging/admin/', authRoutes);
app.use('/emerging/admin/public/', publicRoutes);



//Error handling
app.use( (err, req, res, next) => {
    const error = new Error(err.message);
    error.status = 401;
    next(error);
});

app.use((error, req, res, next) => {
    if(error.message == "Unauthorized from server")
    {
        return res.status(401).json(
            objectives.Error("Email does not exist")
        );
    }
    
    res.status(error.status || 500);
    res.json({
        error: {
            status: "ERROR",
            message: error.message
        }
    })
})

// Error Handling middleware
app.use((err, req, res, next) => {
    let errCode, errMessage
  
    if (err.errors) {
      // mongoose validation error
      errCode = 400 // bad request
      const keys = Object.keys(err.errors)
      // report the first validation error
      errMessage = err.errors[keys[0]].message
    } else {
      // generic or custom error
      errCode = err.status || 500
      errMessage = err.message || 'Internal Server Error'
    }
    res.status(errCode).type('txt')
      .send(errMessage)
})

//Landing Page
app.use('/', function(req, res, next){
    res.status(200).json({ suceess: true });
});

const PORT = process.env.PORT || 2022;

http.listen(PORT, err => {
    if (err) {
        throw err;
    } else {
        console.log('Server running on port: '+PORT);
    }
});
