import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const { EMAIL_USER, EMAIL_PASS, EMAIL_SERVER, EMAIL_TEST } = process.env;


const sendEmail = async (msg, subject, receiver) => {
  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_SERVER,
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: EMAIL_TEST,
      subject,
      html: msg,
      to: receiver,
    });

    return `Message sent: ${nodemailer.getTestMessageUrl(info)}`;
  } catch (err) {
    console.log(err);
    throw new Error('Error sending email');
  }
};

export default sendEmail;
