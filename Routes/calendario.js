const express = require("express");
const calendarioRouter = express.Router();
const { getCalendario, createCalendario, updateCalendario, deleteDateCalendario, clearCalendario,updateDateCalendario } = require("../controllers/calendario")
const getAcces = require("../utils/acces");
const getAccesCalendar = require("../utils/accesCalendar");

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
calendarioRouter.route("/calend")
    .get(getAcces,getAccesCalendar,async (req, res, next) => {
        const { calendarId } = req.params;
        getCalendario(calendarId)
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })
    })

    .put(getAcces,getAccesCalendar,async (req, res, next) => {
        if (req.params.rol === "admin") {
            const { calendarId } = req.params;
            const data = req.body;
            console.log(data);
            updateCalendario(calendarId, data)
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

    .delete(getAcces,getAccesCalendar,async (req, res, next) => {
            const { calendarId } = req.params;
            const data = req.body;
            deleteDateCalendario(calendarId, data)
                .then(response => {
                    res.status(response.status).json(response.data);
                })
                .catch(err => {
                    next(err);
                })
        
    });


/**
 * route for to do the action espisific on individual calendario
 */
calendarioRouter.route("/clear")
.delete(getAcces,getAccesCalendar ,async (req, res, next) => {
    if (req.params.rol == "admin") {
        const { calendarId } = req.params;
        clearCalendario(calendarId)
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



/**
 * route for to do the action espisific on individual calendario
 */
 calendarioRouter.route("/up")
 .put(getAcces,getAccesCalendar,async (req, res, next) => {
        const { calendarId } = req.params;
        const {actualDate,newDate} = req.body;
        updateDateCalendario(calendarId,actualDate,newDate)
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })
});

module.exports = calendarioRouter;