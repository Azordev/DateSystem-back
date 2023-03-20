const express = require("express");
const citaRouter = express.Router();
const { getOneIndicacion, createIndication, updateIndication, deleteIndication, getAllIndicaciones, deleteAllIndications } = require("../controllers/indicaciones")
const getAcces = require("../utils/acces");

/**
 * raiz route of indicaciones
 */
citaRouter.route("/")
    .get(getAcces, async (req, res, next) => {
        console.log(req.params.rol);
        if (req.params.rol == "admin") {
            getAllIndicaciones()
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
            deleteAllIndications()
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
        const { data,observacion,clientId} = req.body;
        const clientId2 = clientId?clientId:req.params.clientId;
        createIndication(data,observacion,clientId2)
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })
    })


/**
 * route for individual indication
 */
citaRouter.route("/indicacion/:id")
    .get(getAcces, async (req, res, next) => {
        const { id } = req.params;
        getOneIndicacion(id)
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
        updateIndication(id, data)
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })
    })

    .delete(getAcces, async (req, res, next) => {
        const { id } = req.params;
        deleteIndication(id)
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })
    });

module.exports = citaRouter;