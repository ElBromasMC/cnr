
const checkAdmin = async (req, res, next) => {

    const user = req.user;

    const group = await user?.getGroup();

    if (group?.name !== "admin"){
        const e = new Error("Usuario sin los privilegios requeridos");
        return res.status(401).json({ msg: e.message });
    }
    
    return next();

}

export default checkAdmin;
