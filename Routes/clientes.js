const express = require("express");
const { getClient, createClient, updateClient, deleteClient, getAllClient, loginClient } = require("../controllers/clientes");
const clienteRouter = express.Router();
const getAcces = require("../utils/acces");



/**
 * raiz route of client
 */
clienteRouter.route("/")
    .get(getAcces, async (req, res, next) => {
        if (req.params.rol == "admin") {
            getAllClient()
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
 * route for register one client
 */
clienteRouter.route("/register")
    .post(async (req, res, next) => {
        const { name, last_name, email, password } = req.body;
        createClient(name, last_name, email, password)
            .then(response => {
                 res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })

    })


    /**
 * route for individual especific client
 */
clienteRouter.route("/cliente")
.get(getAcces, async(req, res, next) => {
   if (req.params.clientId) {
    getClient(req.params.clientId)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(err => {
            next(err);
        })
   } 
    
})

.delete(getAcces,async (req, res, next) => {
    const { clientId } = req.params;
    deleteClient(clientId)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(err => {
            next(err);
        })
});


/**
 * route for individual client
 */
clienteRouter.route("/cliente/:id")
    .get(getAcces, async(req, res, next) => {
        getClient(req.params.id?req.params.id:req.params.clientId)
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })
    })

    .put(getAcces,async(req, res, next) => {
        const { id } = req.params;
        const data = req.body;
        updateClient(id, data)
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })
    })

    .delete(getAcces,async (req, res, next) => {
        const { id } = req.params;
        deleteClient(id)
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })
    });




    

/**
 * route for the client login
 */
clienteRouter.route("/login")
    .post(async (req, res, next) => {
        const { email, password } = req.body;
        loginClient(email, password)
            .then(response => {
                res.status(response.status).json(response);
            })
            .catch(err => {
                next(err);
            })

    })

module.exports = clienteRouter;