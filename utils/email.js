const nodemailer = require("nodemailer");

exports.sendEmail = async (to, subject, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.GMAIL_HOST,
      service: process.env.GMAIL_SERVICE,
      port: process.env.GMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      html: body,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};
