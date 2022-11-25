const calendarioModel = require("../database/models/calendario");

/**
 * this midleware have the control on the acces calendar to the routes
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 */
const getAccesCalendar = async (req, res, next) => {
    calendarioModel.find({})
        .then((result) => {
            if (result.length>0) {
                req.params.calendarId = result[0].id;
                next();
            } else {
                calendarioModel.create({})
                    .then(result2 => {
                        req.params.calendarId = result2.id;
                        next();
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(502).json({ status: 502, data: { message: "error interno" } });
                    })
            }
        }).catch((err) => {
            console.log(err);
            res.status(502).json({ status: 502, data: { message: "error interno" } });
        });
}


module.exports = getAccesCalendar;