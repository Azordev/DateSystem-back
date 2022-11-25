const jwt = require("jsonwebtoken");
const adminModel = require("../database/models/admin");
const { encriptarPassword, comparePassword } = require("../utils/bcryptManager");
const { LogError, LogSuccess, LogInfo } = require("../utils/logger");

class AdminControllerClass {

    /**
     * this method is for get one admin of the database (mongoDB Atlas)
     * @param {*} id 
     * @returns one admin of database if this exist
     */
    getAdmin(id) {
        LogInfo("[GET ADMIN]: id admin is " + id);
        return new Promise((resolve, reject) => {
            if (id) {
                adminModel.findById({ _id: id }, { password: 0 })
                    .then((result) => {
                        if (result === null || result === {}) {
                            LogInfo("[GET ADMIN]: response when get admin is '{}`");
                            resolve({ status: 400, data: { message: "El usuario no existe" } });
                        } else {
                            LogSuccess("[GET ADMIN]: response of geted admin perfect")
                            resolve({ status: 200, data: result });
                        }
                    }).catch((err) => {
                        LogError("[GET ADMIN]:error on get admin");
                        reject({ status: 500, data: err });
                    });
            }
        })
    };



    /**
     * this method is for get All admin of the database (mongoDB Atlas)
     * @returns all admin of database if this exist
     */
    getAllAdmin() {
        return new Promise((resolve, reject) => {
            adminModel.find({}, { password: 0 })
                .then((result) => {
                    if (result.length <= 0) {
                        LogInfo("[GET ALL ADMINS]: response when get all admins is '[]'");
                        resolve({ status: 200, data: { message: "no hay admines" } });
                    } else {
                        LogSuccess("[GET ALL ADMINS]: response of geted all admins perfect")
                        resolve({ status: 200, data: result });
                    }
                }).catch((err) => {
                    LogError("[GET ALL ADMINS]:error on get all admins");
                    reject({ status: 500, data: err });
                });
        })
    }



    /**
     * this method is for create one admin on the database (mongoDB Atlas)
     * @param {*} name 
     * @param {*} last_name 
     * @param {*} email
     * @param {*} password 
     * @returns the admin created
     */
    createAdmin(name, last_name, email,telefono,ubicacion,password) {
        LogInfo("[CREATE ADMIN]: name admin is " + name);
        LogInfo("[CREATE ADMIN]: last name admin is " + last_name);
        LogInfo("[CREATE ADMIN]: email admin is " + email);
        LogInfo("[CREATE ADMIN]: telefono admin is " + telefono);
        LogInfo("[CREATE ADMIN]: ubicacion admin is " + ubicacion);
        LogInfo("[CREATE ADMIN]: password admin is " + password);
        return new Promise((resolve, reject) => {
            if (name && last_name && email && password) {
                encriptarPassword(password)
                    .then((passwordEncripted) => {
                        adminModel.create({ name: name, last_name: last_name, email: email,telefono:telefono,ubicacion:ubicacion,password: passwordEncripted })
                            .then((result) => {
                                LogSuccess("[CREATE ADMIN]: response of created admin perfect");
                                resolve({ status: 201, data: { resgisted: true, message: "registrado correctamente", adminId: result.id } });
                            })
                            .catch(err => {
                                LogError("[CREATE ADMIN]:error on create admin");
                                reject({ status: 502, data: err });
                            })
                    })
                    .catch((err) => {
                        LogError("[CREATE ADMIN]:cant encrite password of admin");
                        reject({ status: 500, data: err });
                    });
            } else {
                LogError("[CREATE ADMIN]:Datos incompletos");
                reject({ status: 406, data: { message: "Datos incompletos" } });
            };
        })
    };


    /**
      * this method is for update one admin on the database (mongoDB Atlas)
     * @param {*} id 
     * @param {*} data 
     * @returns the admin updated
     */
    updateAdmin(id, data) {
        LogInfo("[UPDATE ADMIN]: data admin is " + data);
        return new Promise((resolve, reject) => {
            if (data) {
                adminModel
                    .findByIdAndUpdate({ _id: id }, data, { rawResult: false, password: 0 })
                    .then((result) => {
                        LogSuccess("[UPDATE ADMIN]: response of Update admin perfect");
                        resolve({ status: 200, data: result });
                    })
                    .catch((err) => {
                        LogError("[UPDATE ADMIN]:error of update admin");
                        reject({ status: 502, data: err });
                    });
            } else {
                LogError("[UPDATE ADMIN]:data is null");
                reject({ status: 406, data: { message: "data is null" } });
            };
        })
    };



    /**
     * this method is for delete one admin on the database (mongoDB Atlas)
     * @param {*} id 
     * @returns the admin eliminated
     */
    deleteAdmin(id) {
        LogInfo("[DELETE ADMIN]: id admin is " + id);
        return new Promise((resolve, reject) => {
            adminModel.findByIdAndDelete({ _id: id }, { rawResult: true, password: 0 })
                .then((result) => {
                    LogSuccess("[DELETE ADMIN]: response of delete admin perfect");
                    resolve({ status: 200, data: { message: "admine eliminado correctamente" } });
                })
                .catch((err) => {
                    LogError("[DELETE ADMIN]:error of delete admin");
                    reject({ status: 502, data: err });
                });
        })
    };



    /**
     * this method has the responsabliliy of create one token for de acces of admin
     * @param {*} name 
     * @param {*} password 
     * @returns one token for the acces of admin
     */
    loginAdmin(email, password) {
        LogInfo("[LOGIN ADMIN]: email admin is " + email);
        LogInfo("[LOGIN ADMIN]: password admin is " + password);
        return new Promise((resolve, reject) => {
            if (email && password) {
                adminModel.findOne({ email: email })
                    .then(response => {
                        if (response) {
                            LogInfo("[LOGIN ADMIN]:  admin is " + response._id);
                            comparePassword(password, response.password)
                                .then(isPassword => {
                                    if (isPassword) {
                                        LogInfo("[LOGIN ADMIN]: isPasswor is true");
                                        jwt.sign({ id: response._id }, process.env.SECRET_KEY_ADMIN, { expiresIn: "7d" },
                                            (err, tok) => { tok ? resolve({ status: 200, data: { auth: true, token: tok } }) : reject({ err }) })
                                    } else {
                                        LogError("[LOGIN ADMIN]: isPasswor is false");
                                        resolve({ status: 400, data: { message: "password is incorrect" } });
                                    }
                                }).catch(err => {
                                    LogError("[LOGIN ADMIN]:error comparating password");
                                    reject({ status: 500, data: err });
                                })
                        } else {
                            LogError("[LOGIN ADMIN]:  admin is " + response);
                            resolve({ status: 400, data: { message: "email is incorrect" } });
                        }
                    })
                    .catch(err => {
                        LogError("[LOGIN ADMIN]:error on find admin with email");
                        reject({ status: 502, data: err });
                    })
            } else {
                LogError("[LOGIN ADMIN]:password or email are null");
                reject({ status: 406, data: { message: "password or email are null" } });
            };
        })
    };
}

const adminController = new AdminControllerClass();
module.exports = adminController;