import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Env variables
dotenv.config();

let transporter;
if (process.env.ENABLE_SMTP !== "FALSE") {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.verify().then(() => {
    console.log("Listo para enviar correos");
  })
} else {
  transporter = {}
}

export {
  transporter
}