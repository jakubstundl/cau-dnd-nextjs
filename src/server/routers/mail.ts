import nodemailer from 'nodemailer';
//yqNfA98QshYeZP!* gmail password

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_AUTH_USER, // gmail username
    pass: process.env.GMAIL_AUTH_PASSWORD // gmail password
    ,
  },
});

export const sendEmailVerificationToken = (
  to: string,
  subject: string,
  text: string,
) => {
  const mailOptions = {
    from: 'greenfoxcaudnd@gmail.com',
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error: any, info: any) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
