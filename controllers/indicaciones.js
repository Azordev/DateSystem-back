const indicacionesModel = require("../database/models/indicaciones");
const clienteModel = require("../database/models/clientes");
const { LogError, LogSuccess, LogInfo } = require("../utils/logger");

class IndicacionesControllerClass {
    
    /**
  * this method is for get one indication of the database (mongoDB Atlas)
  * @param {*} id 
  * @returns one indication of database if this exist
  */
    getOneIndicacion(id) {
        LogInfo("[GET INDICACION]: id indicaciones is " + id);
        return new Promise((resolve, reject) => {
            if (id) {
                const resultOfOperation = indicacionesModel.findById({ _id: id })
                .populate("cliente",{indicaciones:0})
                resultOfOperation.then((result) => {
                    if (result === null || result === {}) {
                        LogInfo("[GET INDICACION]: response when get indicacion is '{}'`");
                        resolve({ status: 200, data: { message: "La indicacion no existe" } });
                    } else {
                        LogSuccess("[GET INDICACION]: response of geted indicacion perfect")
                        resolve({ status: 200, data: result });
                    }
                }).catch((err) => {
                    LogError("[GET INDICACION]:error on get indicacion");
                    reject({ status: 500, data: err });
                });
            }
        })
    };



    /**
     * this method is for get All indicaciones of the database (mongoDB Atlas)
     * @returns all indicaciones of database if this exist
     */
    getAllIndicaciones() {
        return new Promise((resolve, reject) => {
            const resultOfOperation = indicacionesModel.find({})
            .populate('cliente',{indicaciones:0});
            resultOfOperation.then((result) => {
                if (result.length <= 0) {
                    LogInfo("[GET ALL INDICACIONES]: response when get all indicaciones is '[]'");
                    resolve({ status: 200, response:[] });
                } else {
                    LogSuccess("[GET ALL INDICACIONES]: response of geted all indicaciones perfect");
                    resolve({ status: 200, data: result });
                }
            }).catch((err) => {
                LogError("[GET ALL INDICACIONES]:error on get all indicaciones");
                reject({ status: 500, data: err });
            });
        })
    }



    /**
     * this method is for create one indicacion on the database (mongoDB Atlas)
     * @param {*} data 
     * @param {*} observacion
     * @param {*} clientId
     * @returns the indicacion created
     */
    createIndication(data, observacion, clientId) {
        LogInfo("[CREATE INDICACION]: data of indication is " + data);
        LogInfo("[CREATE INDICACION]: observacion of indication is " + observacion);
        LogInfo("[CREATE INDICACION]:  clientId of observacion is " + clientId);
        console.log(data, observacion, clientId)
        return new Promise((resolve, reject) => {
            if (data, observacion, clientId) {
                clienteModel.findById({_id:clientId})
                .then(responseOfClient=>{
                    indicacionesModel.create({data:data,observacion:observacion,cliente:clientId})
                    .then(result=>{
                        const new_indication=responseOfClient.indicaciones.concat(result._id);
                        clienteModel.findByIdAndUpdate({_id:clientId},{indicaciones:new_indication})
                        .then(res=>{
                            LogSuccess("[CREATE INDICACION]: response of created indication is perfect");
                            resolve({ status: 201, data: { created: true, message: "indicacion creada correctamente", Comentario: result } });       
                        })
                        .catch(err=>{
                            LogError("[CREATE INDICACION]:indication created but cant add this indication in his client");
                            resolve({status: 502, message:"cant add this indication in his client"})
                        })
                    })
                    .catch(err=>{
                        LogError("[CREATE INDICACION]:error on create indication");
                        reject({ status: 502, data: err });
                    })
                })
                .catch(err=>{
                    LogError("[CREATE INDICACION]:cant find the indication");
                     reject({ status: 502, data: err });
                })
            } else {
                LogError("[CREATE INDICACION]:data or observacion or clientId are null");
                reject({ status: 406, data: { message: "data or observacion or clientId are null" } });
            };
        })
    };


    /**
        * this method is for update one indication on the database (mongoDB Atlas)
     * @param {*} id 
     * @param {*} data 
     * @returns the indication updated
     */
    updateIndication(id, data) {
        LogInfo("[UPDATE INDICACION]: data indication is " + data);
        return new Promise((resolve, reject) => {
            if (data) {
                indicacionesModel
                    .findByIdAndUpdate({ _id: id }, data, { rawResult: true })
                    .then((result) => {
                        LogSuccess("[UPDATE INDICACION]: response of Update Indication perfect");
                        resolve({ status: 200, data: result });
                    })
                    .catch((err) => {
                        LogError("[UPDATE INDICACION]:error of update Indication");
                        reject({ status: 502, data: err });
                    });
            } else {
                LogError("[UPDATE INDICACION]:data is null");
                reject({ status: 406, data: { message: "data is null" } });
            };
        })
    };



    /**
     * this method is for delete one indication on the database (mongoDB Atlas)
     * @param {*} id 
     * @returns the indication eliminated
     */
    deleteIndication(id) {
        LogInfo("[DELETE INDICACION]: id indication is " + id);
        return new Promise((resolve, reject) => {
            indicacionesModel.findByIdAndDelete({ _id: id }, { rawResult: true })
                .then((result) => {
                    LogSuccess("[DELETE INDICACION]: response of delete indication perfect");
                    resolve({status: 200, data:{ message:"indicacion eliminada correctamente", indicacion: result._id } });
                })
                .catch((err) => {
                    LogError("[DELETE INDICACION]:error of delete indication");
                    reject({ status: 502, data: err });
                });
        })
    };

    /**
     * this method is for delete all indications on the database (mongoDB Atlas)
     * @returns the indications eliminated
     */
         deleteAllIndications() {
            return new Promise((resolve, reject) => {
                indicacionesModel.deleteMany({})
                    .then((result) => {
                        LogSuccess("[DELETE ALL INDICATION]: response of delete all indications perfect");
                        resolve({ status: 200, data: { message: "indicaciones eliminadas correctamente"} });
                    })
                    .catch((err) => {
                        LogError("[DELETE ALL CITA]:error of delete all indications");
                        reject({ status: 502, data: err });
                    });
            })
        };
}


const indicacionesController = new IndicacionesControllerClass();
module.exports = indicacionesController;