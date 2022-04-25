//const transporters = require('./mailer').transporter;
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
require('dotenv').config();

var transporter = nodemailer.createTransport({
  host:  process.env.MAIL_HOST,
  port:  process.env.MAIL_PORT,
  auth: {
    user:  process.env.MAIL_USERNAME,
    pass:  process.env.MAIL_PASSWORD
  },
  secure:false,
  tls: {rejectUnauthorized: false},
});

var options = {
    viewEngine : {
        extname: '.hbs', // handlebars extension
        layoutsDir: __dirname + '/views/', // location of handlebars templates
        defaultLayout: 'send_admin', // name of main template
    },
    viewPath: __dirname + '/views/',
    extName: '.hbs'
};

const sendMail = async option => {
   
    await transporter.use('compile', hbs(options));

    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: option.email,
      subject: "Admin login password",
      template: 'send_admin',
      context: {
        name: `${option.name}`,
        password: `${option.password}`,
        url: `${option.url}`,
      }
    };
  
    const info = await transporter.sendMail(message);
    return info;
}

module.exports = {sendMail}


