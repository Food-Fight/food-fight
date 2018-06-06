const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD,
  },
});

exports.signupOptions = address => ({
  from: 'moomoocrunchy@gmail.com',
  to: address,
  subject: 'Thanks For Signing Up For FoodFight',
  html: '<b>Welcome to FoodFight!</b>',
});

exports.sendMail = (options) => {
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
};
