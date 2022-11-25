const express = require("express");
const citaRouter = express.Router();
const { getOneCita, createCita, updateCita, deleteCita, getAllCitas, deleteAllCitas } = require("../controllers/citas")
const getAcces = require("../utils/acces");

/**
 * raiz route of citas
 */
citaRouter.route("/")
    .get(getAcces, async (req, res, next) => {
        console.log(req.params.rol);
        if (req.params.rol == "admin") {
            getAllCitas()
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

    .delete(getAcces, async (req, res, next) => {
        if (req.params.rol == "admin") {
            deleteAllCitas()
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


    .post(getAcces, async (req, res, next) => {
        const { motivo,desde,hasta,status,clientId} = req.body;
        const clientId2 = clientId?clientId:req.params.clientId;
        const status2=status?status:null;
        createCita(motivo, desde, hasta,status2,clientId2)
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
                res.status(response.status).json(response);
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
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })
    })

    .delete(getAcces, async (req, res, next) => {
        const { id } = req.params;
        deleteCita(id)
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })
    });

module.exports = citaRouter;