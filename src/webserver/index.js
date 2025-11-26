import express from "express";
import dotenv from "dotenv";
import db from "./models/index.js";
import publicRoutes from "./routes/publicRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";

const app = express();

// Express json parser
app.use(express.json());

// Env variables
dotenv.config();

// Database conection
db.authenticate()
    .then(() => console.log('Base de datos conectada'))
    .catch(error => console.log(error))

// Routes
app.use("/", publicRoutes)
app.use("/api/users", userRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/testimonials", testimonialRoutes);

// Port
const PORT = process.env.PORT || 8080;

// Listen
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});
