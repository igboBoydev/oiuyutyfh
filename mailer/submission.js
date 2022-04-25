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
        defaultLayout: 'submission', // name of main template
    },
    viewPath: __dirname + '/views/',
    extName: '.hbs'
};

const sendMail = async option => {
   
    await transporter.use('compile', hbs(options));

    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: option.email,
      subject: "Your Application Has Been Submitted",
      template: 'submission',
      context: {
        name: option.name
      }
    };
  
    const info = await transporter.sendMail(message);
    console.log(info.messageId);
    return info;
}

module.exports = {sendMail}


