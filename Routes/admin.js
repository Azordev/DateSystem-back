const express = require("express");
const { getAdmin, createAdmin, updateAdmin, deleteAdmin, getAllAdmin, loginAdmin } = require("../controllers/admin");
const adminRouter = express.Router();
const getAcces = require("../utils/acces");

/**
 * raiz route of Admin
 */
adminRouter.route("/")
    .get(getAcces, async (req, res, next) => {
        getAllAdmin()
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })
    })


/**
 * route for register one Admin
 */
adminRouter.route("/register")
    .post(async (req, res, next) => {
        const { name, last_name, email,telefono,ubicacion,password } = req.body;
        createAdmin(name, last_name, email,telefono,ubicacion,password)
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })

    })

/**
 * route for individual Admin
 */
 adminRouter.route("/admin")
 .get(getAcces, async (req, res, next) => {
     if (req.params.rol == "admin") {
         const {adminId} = req.params;
         getAdmin(adminId)
             .then(response => {
                 res.status(response.status).json(response);
             })
             .catch(err => {
                 next(err);
             })
     } else {
         res.status(401).send({ message: "acceso denegado" })
     }
 })


 .put(getAcces, async (req, res, next) => {
    if (req.params.rol == "admin") {
        const {adminId} = req.params;
        const data = req.body;
        updateAdmin(adminId, data)
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })
    } else {
        res.status(401).send({ message: "acceso denegado" })
    }
})

/**
 * route for individual Admin with id
 */
adminRouter.route("/admin/:id")
    .get(getAcces, async (req, res, next) => {
        if (req.params.rol == "admin") {
            const { id,clientId} = req.params;
            getAdmin(clientId?clientId:id)
                .then(response => {
                    res.status(response.status).json(respose);
                })
                .catch(err => {
                    next(err);
                })
        } else {
            res.status(401).send({ message: "acceso denegado" })
        }
    })


    .delete(getAcces, async (req, res, next) => {
        if (req.params.rol == "admin") {
            const { id } = req.params;
            deleteAdmin(id)
                .then(response => {
                    res.status(response.status).json(response);
                })
                .catch(err => {
                    next(err);
                })
        } else {
            res.status(401).send({ message: "acceso denegado" })
        }
    });


/**
 * route for the Admin login
 */
adminRouter.route("/login")
    .post(async (req, res, next) => {
        const { email, password } = req.body;
        loginAdmin(email, password)
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })

    })

module.exports = adminRouter;