import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const checkAuth = async (req, res, next) => {
    let token;
    let auth = req.headers.authorization;

    if (auth && auth.startsWith("Bearer")) {
        try {
            token = auth.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ["password", "token", "confirmed"] }
            });
            req.user = user
            console.log(user)
            return next();
        } catch {
            const e = new Error("Token no Válido");
            return res.status(403).json({ msg: e.message });
        }
    }

    if (!token) {
        const error = new Error("Token no válido o inexistente");
        return res.status(403).json({ msg: error.message });
    }

    next();
}

export default checkAuth;
