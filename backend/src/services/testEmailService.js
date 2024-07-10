import sendEmail from './email.services.js';
import {EMAIL_USER,EMAIL_PASS} from "../config/configEnv.js";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

async function testSendEmail() {
  const info = await transporter.sendMail({
    from: '"Proyecto ingenieria de software👻" <${EMAIL_USER}>', // sender address
    to: "anays.mansilla2001@alumnos.ubiobio.cl, mayramansilla869@gmail.com,matias.pereira2001@alumnos.ubiobio.cl,felipepd14@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    
  });
}
testSendEmail();
