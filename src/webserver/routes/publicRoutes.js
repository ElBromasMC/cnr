import path from "path";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import { transporter } from "../config/mailer.js";

// Load .env variables
dotenv.config();

// ES6 dirname
const __dirname = import.meta.dirname;

const router = express.Router();

const reactAppPatch = path.join(__dirname, '..', '..', 'frontend', 'dist');
const pagePatch = path.join(__dirname, '..', 'public');

// Middleware
router.use('/menu', express.static(reactAppPatch));
router.use(express.static(pagePatch));
router.use(express.json());

// Routing
router.get('/menu/*', function (req, res) {
    res.sendFile(path.join(reactAppPatch, 'index.html'));
});

router.post("/contact", multer().array(), async (req, res) => {
    const { name, email, cellphone, subject, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({
            msg: "Debe ingresar los siguientes campos: name, email, message"
        })
    }

    try {
        // Send email
        await transporter.sendMail({
            from: `"Página web" <${process.env.SMTP_USER}>`,
            to: process.env.MAIL_TO,
            subject: `${subject}`,
            html: `
            <span><strong>Nombre: </strong>${name}</span>
            <br>
            <span><strong>Correo: </strong>${email}</span>
            <br>
            <span><strong>Teléfono: </strong>${cellphone}</span>
            <br>
            <span><strong>Mensaje: </strong>${message}</span>
            `,
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: "Error al enviar el formulario"
        })
    }

    return res.json({
        msg: "Formulario enviado exitosamente"
    })
});

router.get('/', function (req, res) {
    res.sendFile(path.join(pagePatch, 'index.html'));
});

export default router;
