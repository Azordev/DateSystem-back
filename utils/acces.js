const jwt = require("jsonwebtoken");

/**
 * this midleware have the control on the acces to the routes
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getAcces = async (req, res, next) => {
    const tokenRequired = req.headers["x-acces-token"];
    if (tokenRequired) {
        jwt.verify(tokenRequired, process.env.SECRET_KEY_CLIENT, (err, result) => {
            if (result) {
                req.params.rol = "client";
                req.params.clientId = result.id;
                next();
            } else if (err) {
                jwt.verify(tokenRequired, process.env.SECRET_KEY_ADMIN, (err, result) => {
                    if (result) {
                        req.params.rol = "admin";
                        req.params.adminId = result.id;
                        next();
                    } else if (err) {
                        console.log(err);
                        res.status(401).json({ auth: false, message: "debes logearte nuevamente, no tienes acceso" });
                    }
                })
            }
        })
    } else { res.status(406).json({ auth: false, message: "token requerido" }) }
}

module.exports = getAcces;
