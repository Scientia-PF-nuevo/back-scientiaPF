var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'scientiapf@gmail.com',
      pass: '123456789scientia'
    }
  });
       
module.exports = transporter;

//objeto para enviar el mail dentro de la ruta

/**
var transporter = require('../mailer/mailer'); 

var mailOptions = {
      from: "quien envia",
      to: 'detinatario',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!',
       html: '<b>That was easy!</b>'

    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });


 */