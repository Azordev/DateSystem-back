const citaModel = require("../database/models/citas");
const clienteModel = require("../database/models/clientes");
const calendarioModel = require("../database/models/calendario");
const adminModel = require("../database/models/admin");
const { LogError, LogSuccess, LogInfo } = require("../utils/logger");
class CalendarioControllerClass {
    /**
     * this method is for get calendar of the database (mongoDB Atlas)
     * @param {*} id 
     * @returns calendar of database if this exist
     */
    getCalendario(id) {
        LogInfo("[GET CALENDARIO]: id Calendario is " + id);
        return new Promise((resolve, reject) => {
            if (id) {
                calendarioModel.findById({ _id: id })
                    .then((result) => {
                        if (result === null || result === {}) {
                            LogInfo("[GET CALENDARIO]: response when get Calendario is '{}'`");
                            resolve({ status: 200, data: { message: "El Calendario no existe" } });
                        } else {
                            LogSuccess("[GET CALENDARIO]: response of geted Calendario perfect")
                            resolve({ status: 200, data: result });
                        }
                    }).catch((err) => {
                        LogError("[GET CALENDARIO]:error on get Calendario");
                        reject({ status: 500, data: err });
                    });
            }
        })
    };

    /**
     * this method is for create  calendar on the database (mongoDB Atlas)
     * @param {*} calendar 
     * @returns the calendar created
     */
    createCalendario() {
        return new Promise((resolve, reject) => {
            calendarioModel.create({})
                .then(result => {
                    LogSuccess("[CREATE CALENDARIO]: response of created Calendario perfect");
                    resolve({ status: 201, data: { created: true, message: "Calendario creado correctamente", Calendario: result } });
                })
                .catch(err => {
                    LogError("[CREATE CALENDARIO]:error on create Calendario");
                    reject({ status: 502, data: err });
                })
        })
    };

    /**
      * this method is for update one calendar on the database (mongoDB Atlas)
     * @param {*} id 
     * @param {*} fecha_bloqueada 
     * @param {*} fecha_citada 
     * @returns the calendar updated
     */
    updateCalendario(id,data) {
        LogInfo("[UPDATE CALENDARIO]: id is " + id);
        LogInfo("[UPDATE CALENDARIO]:data is "+ data);
        return new Promise((resolve, reject) => {
            if (id,data) {
                calendarioModel.findById({_id:id})
                .then(result=>{
                    if (result === null || result === {}) {
                        LogInfo("[UPDATE CALENDARIO]: response when get Calendario is '{}'`");
                        resolve({ status: 200, data: { message: "El Calendario no existe" } });
                    } else {
                        const dataToSend={};
                        if (data.fecha_bloqueada) {
                            const new_fechas_bloqueadas=result.fechas_bloqueadas.concat(data.fecha_bloqueada);
                            dataToSend.fechas_bloqueadas=new_fechas_bloqueadas;
                        }
                        if (data.fecha_citada) {
                            const new_fechas_citadas=result.fechas_citadas.concat(data.fecha_citada);
                            dataToSend.fechas_citadas=new_fechas_citadas;
                        }
                        calendarioModel.findByIdAndUpdate({_id:id},dataToSend,{ rawResult: false })
                        .then(respons=>{
                            LogSuccess("[UPDATE CALENDARIO]: response of Update Calendar perfect");
                            resolve({ status: 200, data: respons});
                        }).catch(err=>{
                            LogError("[UPDATE CALENDARIO]:error of update Calendar");
                            reject({ status: 502, data: err });
                        })
                    }
                })
                .catch(err=>{
                    LogError("[UPDATE CALENDARIO]:error on the search Calendar for update");
                    reject({ status: 502, data: err });
                })
            } else {
                LogError("[UPDATE CALENDARIO]:datos incompletos");
                reject({ status: 406, data: { message: "datos incompletos" } });
            };
        })
    };

     /**
      * this method is for clear the calendar on the database (mongoDB Atlas)
     * @returns the calendar clear
     */
      clearCalendario(id) {
        LogInfo("[CLEAR CALENDARIO]: id is " + id);
        return new Promise((resolve, reject) => {
            if (id) {
                calendarioModel.findById({_id:id})
                .then(result=>{
                    if (result === null || result === {}) {
                        LogInfo("[CLEAR CALENDARIO]: response when get Calendario is '{}'`");
                        resolve({ status: 200, data: { message: "El Calendario no existe" } });
                    } else {
                        calendarioModel.findByIdAndUpdate({_id:id},{fechas_bloqueadas:[],fechas_citadas:[]},{ rawResult: false })
                        .then(respons=>{
                            LogSuccess("[CLEAR CALENDARIO]: response of clear Calendar perfect");
                            resolve({ status: 200, data: respons});
                        }).catch(err=>{
                            LogError("[CLEAR CALENDARIO]:error of clear Calendar");
                            reject({ status: 502, data: err });
                        })
                    }
                })
                .catch(err=>{
                    LogError("[CLEAR CALENDARIO]:error on the search Calendar for update");
                    reject({ status: 502, data: err });
                })
            } else {
                LogError("[CLEAR CALENDARIO]:id del calendario no existe");
                reject({ status: 406, data: { message: "id del calendario no existe" } });
            };
        })
    };

     /**
      * this method is for delete one date of the calendar on the database (mongoDB Atlas)
     * @param {*} id 
     * @param {*} fecha_bloqueada 
     * @param {*} fecha_citada 
     * @returns the calendar updated
     */
      deleteDateCalendario(id,data) {
        LogInfo("[DELETE DATE]: id is " + id);
        LogInfo("[DELETE DATE]:data is "+ data);
        return new Promise((resolve, reject) => {
            if (id,data) {
                calendarioModel.findById({_id:id})
                .then(result=>{
                    if (result === null || result === {}) {
                        LogInfo("[DELETE DATE]: response when get Calendario is '{}'`");
                        resolve({ status: 200, data: { message: "El Calendario no existe" } });
                    } else {
                        const dataToSend={};
                        if (data.fecha_bloqueada) {
                            const allDateBloq=result.fechas_bloqueadas;
                            const dateToDeleteDesde = new Date(data.fecha_bloqueada.desde);
                            const dateToDeleteHasta = new Date(data.fecha_bloqueada.hasta);
                            const new_fechas_bloqueadas=allDateBloq.filter(d=>(d.desde.toString() !== dateToDeleteDesde.toString())&&d.hasta.toString() !== dateToDeleteHasta.toString());
                            dataToSend.fechas_bloqueadas=new_fechas_bloqueadas;
                        }
                        if (data.fecha_citada) {
                            const allDateBloq=result.fechas_citadas;
                            const dateToDeleteDesde = new Date(data.fecha_citada.desde);
                            const dateToDeleteHasta = new Date(data.fecha_citada.hasta);
                            const new_fechas_citadas=allDateBloq.filter(d=>(d.desde.toString() !== dateToDeleteDesde.toString())&&(d.hasta.toString() !== dateToDeleteHasta.toString()));
                            dataToSend.fechas_citadas=new_fechas_citadas;
                        }
                        calendarioModel.findByIdAndUpdate({_id:id},dataToSend,{ rawResult: false })
                        .then(respons=>{
                            LogSuccess("[DELETE DATE]: response at delete date of Calendar perfect");
                            resolve({ status: 200, data: respons});
                        }).catch(err=>{
                            LogError("[DELETE DATE]:error at delete date of Calendar");
                            reject({ status: 502, data: err });
                        })
                    }
                })
                .catch(err=>{
                    LogError("[DELETE DATE]:error on the search Calendar for delete date");
                    reject({ status: 502, data: err });
                })
            } else {
                LogError("[DELETE DATE]:datos incompletos");
                reject({ status: 406, data: { message: "datos incompletos" } });
            };
        })
    };

     /**
      * this method is for update one date of the calendar on the database (mongoDB Atlas)
     * @param {*} id 
     * @param {*} actualDate 
     * @param {*} newDate 
     * @returns the calendar updated
     */
      updateDateCalendario(id,actualDate,newDate) {
        LogInfo("[UPDATE DATE]: actual date is " + actualDate);
        LogInfo("[UPDATE DATE]:new date is "+ newDate);
        return new Promise((resolve, reject) => {
            if (id,actualDate,newDate) {
                calendarioModel.findById({_id:id})
                .then(result=>{
                    if (result === null || result === {}) {
                        LogInfo("[UPDATE DATE]: response when get Calendario is '{}'`");
                        resolve({ status: 200, data: { message: "El Calendario no existe" } });
                    } else {
                        const dataToSend={};
                            const allDateBloq=result.fechas_citadas;
                            const dateToDeleteDesde = new Date(actualDate.desde);
                            const dateToDeleteHasta = new Date(actualDate.hasta);
                            let new_fechas_citadas=allDateBloq.filter(d=>(d.desde.toString() !== dateToDeleteDesde.toString())&&(d.hasta.toString() !== dateToDeleteHasta.toString()));
                            new_fechas_citadas=[...new_fechas_citadas,newDate];
                            dataToSend.fechas_citadas=new_fechas_citadas;
                        calendarioModel.findByIdAndUpdate({_id:id},dataToSend,{ rawResult: false })
                        .then(respons=>{
                            LogSuccess("[UPDATE DATE]: response at update date of Calendar perfect");
                            resolve({ status: 200, data: respons});
                        }).catch(err=>{
                            LogError("[UPDATE DATE]:error at update date of Calendar");
                            reject({ status: 502, data: err });
                        })
                    }

                })
                .catch(err=>{
                    LogError("[UPDATE DATE]:error on the search Calendar for delete date");
                    reject({ status: 502, data: err });
                })
            } else {
                LogError("[UPDATE DATE]:datos incompletos");
                reject({ status: 406, data: { message: "datos incompletos" } });
            };
        })
    };

    /**
     * this method is for delete one calendario on the database (mongoDB Atlas)
     * @param {*} id 
     * @returns the calendario eliminated
     */
    deleteCalendario(id) {
        LogInfo("[DELETE CALENDARIO]: id Calendario is " + id);
        return new Promise((resolve, reject) => {
            calendarioModel.findByIdAndDelete({ _id: id }, { rawResult: true })
                .then((result) => {
                    LogSuccess("[DELETE CALENDARIO]: response of delete Calendario perfect");
                    resolve({ status: 200, data: { message: "Calendario eliminado correctamente" } });
                })
                .catch((err) => {
                    LogError("[DELETE CALENDARIO]:error of delete Calendario");
                    reject({ status: 502, data: err });
                });
        })
    };
}
const calendarioController = new CalendarioControllerClass();
module.exports = calendarioController;