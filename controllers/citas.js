const citaModel = require("../database/models/citas");
const clienteModel = require("../database/models/clientes");
const calendarioModel = require("../database/models/calendario");
const adminModel = require("../database/models/admin");
const { LogError, LogSuccess, LogInfo } = require("../utils/logger");

class CitasControllerClass {
    
    /**
  * this method is for get one cita of the database (mongoDB Atlas)
  * @param {*} id 
  * @returns one cita of database if this exist
  */
    getOneCita(id) {
        LogInfo("[GET CITA]: id cita is " + id);
        return new Promise((resolve, reject) => {
            if (id) {
                const resultOfOperation = citaModel.findById({ _id: id })
                .populate("cliente",{citas:0})
                resultOfOperation.then((result) => {
                    if (result === null || result === {}) {
                        LogInfo("[GET CITA]: response when get cita is '{}'`");
                        resolve({ status: 200, data: { message: "El cita no existe" } });
                    } else {
                        LogSuccess("[GET CITA]: response of geted cita perfect")
                        resolve({ status: 200, data: result });
                    }
                }).catch((err) => {
                    LogError("[GET CITA]:error on get cita");
                    reject({ status: 500, data: err });
                });
            }
        })
    };

    /**
     * this method is for get All citas of the database (mongoDB Atlas)
     * @returns all citas of database if this exist
     */
    getAllCitas() {
        return new Promise((resolve, reject) => {
            const resultOfOperation = citaModel.find({})
            .populate('cliente',{citas:0});
            resultOfOperation.then((result) => {
                if (result.length <= 0) {
                    LogInfo("[GET ALL CITA]: response when get all citas is '[]'");
                    resolve({ status: 200, data:[] });
                } else {
                    LogSuccess("[GET ALL CITA]: response of geted all citas perfect");
                    resolve({ status: 200, data: result });
                }
            }).catch((err) => {
                LogError("[GET ALL CITA]:error on get all citas");
                reject({ status: 500, data: err });
            });
        })
    }

    /**
     * this method is for create one cita on the database (mongoDB Atlas)
     * @param {*} motivo 
     * @param {*} clientId
     * @param {} date_of_cita
     * @param {*} desde_hora
     * @param {*} hasta_hora
     * @param {} date_of_cita
     * @returns the cita created
     */
    createCita(motivo, desde, hasta, status, clientId) {
        LogInfo("[CREATE CITA]: motivo of cita is " + motivo);
        LogInfo("[CREATE CITA]:  clientId of cita is " + clientId);
        console.log(motivo, desde, hasta, status, clientId)
        return new Promise((resolve, reject) => {
            if (motivo, desde, hasta, status, clientId) {
                clienteModel.findById({_id:clientId})
                .then(responseOfClient=>{
                    citaModel.create({motivo:motivo,desde:desde,hasta:hasta,status:status?status:"espera",cliente:clientId})
                    .then(result=>{
                        const new_citas=responseOfClient.citas.concat(result._id);
                        clienteModel.findByIdAndUpdate({_id:clientId},{citas:new_citas})
                        .then(res=>{
                            LogSuccess("[CREATE CITA]: response of created cita perfect");
                            resolve({ status: 201, data: { created: true, message: "cita creada correctamente", Comentario: result } });       
                        })
                        .catch(err=>{
                            LogError("[CREATE CITA]:cita created but cant add this cita in his client");
                            resolve({status: 502, message:"cant add this cita in his client"})
                        })
                    })
                    .catch(err=>{
                        LogError("[CREATE CITA]:error on create cita");
                        reject({ status: 502, data: err });
                    })
                })
                .catch(err=>{
                    LogError("[CREATE CITA]:cant find the client");
                     reject({ status: 502, data: err });
                })
            } else {
                LogError("[CREATE CITA]:motivo or name or clientId or date_of_cita are null");
                reject({ status: 406, data: { message: " or motivo or clientId or date_of_cita are null" } });
            };
        })
    };


    /**
      * this method is for update one cita on the database (mongoDB Atlas)
     * @param {*} id 
     * @param {*} data 
     * @returns the cita updated
     */
    updateCita(id, data) {
        LogInfo("[UPDATE CITA]: data cita is " + data);
        return new Promise((resolve, reject) => {
            if (data) {
                citaModel
                    .findByIdAndUpdate({ _id: id }, data, { rawResult: true })
                    .then((result) => {
                        LogSuccess("[UPDATE CITA]: response of Update cita perfect");
                        resolve({ status: 200, data: result });
                    })
                    .catch((err) => {
                        LogError("[UPDATE CITA]:error of update cita");
                        reject({ status: 502, data: err });
                    });
            } else {
                LogError("[UPDATE CITA]:data is null");
                reject({ status: 406, data: { message: "data is null" } });
            };
        })
    };



    /**
     * this method is for delete one cita on the database (mongoDB Atlas)
     * @param {*} id 
     * @returns the cita eliminated
     */
    deleteCita(id) {
        LogInfo("[DELETE CITA]: id cita is " + id);
        return new Promise((resolve, reject) => {
            citaModel.findByIdAndDelete({ _id: id }, { rawResult: true })
                .then((result) => {
                    LogSuccess("[DELETE CITA]: response of delete cita perfect");
                    resolve({status: 200, data:{ message:"cita eliminada correctamente", cita: result._id } });
                })
                .catch((err) => {
                    LogError("[DELETE CITA]:error of delete cita");
                    reject({ status: 502, data: err });
                });
        })
    };

    /**
     * this method is for delete all citas on the database (mongoDB Atlas)
     * @returns the cita eliminated
     */
         deleteAllCitas() {
            return new Promise((resolve, reject) => {
                citaModel.deleteMany({})
                    .then((result) => {
                        LogSuccess("[DELETE ALL CITA]: response of delete all citas perfect");
                        resolve({ status: 200, data: { message: "citas eliminadas correctamente"} });
                    })
                    .catch((err) => {
                        LogError("[DELETE ALL CITA]:error of delete all citas");
                        reject({ status: 502, data: err });
                    });
            })
        };
}


const citasController = new CitasControllerClass();
module.exports = citasController;