import { User } from "../models/User.js";
import { Group } from "../models/Group.js";
import generateID from "../helpers/generateID.js"
import generateJWT from "../helpers/generateJWT.js"

const register = async (req, res) => {
    const { email, name, password } = req.body;

    // Check not null
    if (!email || !name || !password) {
        const error = new Error("Debe ingresar los siguientes campos: email, name, password");
        return res.status(400).json({ msg: error.message });
    }

    // Check duplicate email
    const userExists = await User.findOne({
        where: { email }
    });
    if (userExists) {
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Save new user
        const user = new User({ ...req.body, token: generateID() }, {
            fields: ["name", "email", "password", "phone", "token"]
        });
        await user.save();

    } catch {
        const error = new Error("Error desconocido al registrar el usuario");
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Send verification email

    } catch {
        const error = new Error("Error desconocido al enviar el correo de verificación");
        return res.status(400).json({ msg: error.message });
    }

    res.json({
        msg: "Usuario creado exitosamente"
    });

};

const profile = (req, res) => {
    const { user } = req;
    res.json(user);
};

const confirm = async (req, res) => {
    const { token } = req.params;
    const userConfirm = await User.findOne({
        where: { token }
    });

    // Check token
    if (!userConfirm) {
        const error = new Error("Token no válido");
        return res.status(404).json({ msg: error.message });
    }

    // Confirm user
    try {
        userConfirm.token = null;
        userConfirm.confirmed = true;
        await userConfirm.save();
        res.json({ msg: "Usuario confirmado correctamente" });
    } catch (e) {
        const error = new Error("Error desconocido al confirmar el usuario");
        console.log(e)
        return res.status(400).json({ msg: error.message });
    }
};

const authenticate = async (req, res) => {
    const { email, password } = req.body;

    // Check not null
    if (!email || !password) {
        const error = new Error("Debe ingresar los siguientes campos: email, password");
        return res.status(400).json({ msg: error.message });
    }

    // Check if user exists
    const user = await User.findOne({
        where: { email }
    });
    if (!user) {
        const error = new Error("El usuario proporcionado no existe");
        return res.status(404).json({ msg: error.message });
    }

    // Check user confiramation
    if (!user.confirmed) {
        const error = new Error("El usuario no ha sido confirmado");
        return res.status(403).json({ msg: error.message });
    }

    // Check password
    if (!(await user.checkPassword(password))) {
        const error = new Error("La contraseña es incorrecta");
        return res.status(403).json({ msg: error.message });
    }

    // Auth
    res.json({
        token: generateJWT(user.id),
    });
};

export {
    register,
    profile,
    confirm,
    authenticate
};