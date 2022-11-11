const express = require("express");
const citaRouter = express.Router();
const { getOneCita, createCita, updateCita, deleteCita, getAllCitas } = require("../controllers/citas")
const getAcces = require("../utils/acces");


/**
 * raiz route of citas
 */
citaRouter.route("/")
    .get(getAcces, async (req, res, next) => {
        if (req.params.rol == "admin") {
            getAllCitas()
                .then(response => {
                    res.status(response.status).json({status:response.status,data:response.data});
                })
                .catch(err => {
                    next(err);
                })
        } else {
            res.status(401).send({ message: "acceso denegado" })
        }
    })

    .post(getAcces, async (req, res, next) => {
        const { motivo,date_of_cita } = req.body;
        const clientId = req.params.clientId;
        createCita(motivo,clientId,date_of_cita)
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })
    })


/**
 * route for individual cita
 */
citaRouter.route("/cita/:id")
    .get(getAcces, async (req, res, next) => {
        const { id } = req.params;
        getOneCita(id)
            .then(response => {
                res.status(response.status).json(response.data);
            })
            .catch(err => {
                next(err);
            })
    })

    .put(getAcces, async (req, res, next) => {
        const { id } = req.params;
        const data = req.body;
        updateCita(id, data)
            .then(response => {
                res.status(response.status).json(response.data);
            })
            .catch(err => {
                next(err);
            })
    })

    .delete(getAcces, async (req, res, next) => {
        const { id } = req.params;
        deleteCita(id)
            .then(response => {
                res.status(response.status).json(response.data);
            })
            .catch(err => {
                next(err);
            })
    });

module.exports = citaRouter;