const express = require("express");
const calendarioRouter = express.Router();
const { getCalendario, createCalendario, updateCalendario, deleteDateCalendario } = require("../controllers/calendario")
const getAcces = require("../utils/acces");

/**
 * raiz route of calendario
 */
calendarioRouter.route("/")
    .post(getAcces, async (req, res, next) => {
        if (req.params.rol == "admin") {
            createCalendario()
                .then(response => {
                    res.status(response.status).json(response.data);
                })
                .catch(err => {
                    next(err);
                })
        } else {
            res.status(401).send({ message: "acceso denegado" })
        }
    })


/**
 * route for individual calendario
 */
calendarioRouter.route("/:id")
    .get(getAcces, async (req, res, next) => {
        const { id } = req.params;
        getCalendario(id)
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })
    })

    .put(getAcces,async (req, res, next) => {
        if (req.params.rol === "admin") {
            const { id } = req.params;
            const data = req.body;
            updateCalendario(id, data)
                .then(response => {
                    res.status(response.status).json(response.data);
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
            const data = req.body;
            deleteDateCalendario(id, data)
                .then(response => {
                    res.status(response.status).json(response.data);
                })
                .catch(err => {
                    next(err);
                })
        } else {
            res.status(401).send({ message: "acceso denegado" })
        }
    });


module.exports = calendarioRouter;