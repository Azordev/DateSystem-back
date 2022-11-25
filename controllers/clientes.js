const jwt = require("jsonwebtoken");
const citaModel = require("../database/models/citas");
const clienteModel = require("../database/models/clientes");
const calendarioModel = require("../database/models/calendario");
const adminModel = require("../database/models/admin");
const { encriptarPassword, comparePassword } = require("../utils/bcryptManager");
const { LogError, LogSuccess, LogInfo } = require("../utils/logger");
const { deleteDateCalendario } = require("./calendario");


class clientControllerClass {

  /**
   * this method is for get one client of the database (mongoDB Atlas)
   * @param {*} id 
   * @returns one client of database if this exist
   */
  getClient(id) {
    LogInfo("[GET CLIENT]: id client is " + id);
    return new Promise((resolve, reject) => {
      if (id) {
        const resultOfOperation = clienteModel.findById({ _id: id }, { password: 0 })
          .populate("citas", { cliente: 0 })
        resultOfOperation.then((result) => {
          if (result === null || result === {}) {
            LogInfo("[GET CLIENT]: response when get client is '{}`");
            resolve({ status: 200, data: { message: "El usuario no existe" } });
          } else {
            LogSuccess("[GET CLIENT]: response of geted client perfect")
            resolve({ status: 200, data: result });
          }
        }).catch((err) => {
          LogError("[GET CLIENT]:error on get client");
          reject({ status: 500, data: err });
        });
      }
    })
  };



  /**
   * this method is for get All client of the database (mongoDB Atlas)
   * @returns all client of database if this exist
   */
  getAllClient() {
    return new Promise((resolve, reject) => {
      const resultOfOperation = clienteModel.find({}, { password: 0 })
        .populate("citas", { cliente: 0 })
      resultOfOperation.then((result) => {
        if (result.length <= 0) {
          LogInfo("[GET ALL CLIENTS]: response when get all clients is '[]'");
          resolve({ status: 400, data: { message: "no hay clientes" } });
        } else {
          LogSuccess("[GET ALL CLIENTS]: response of geted all clients perfect")
          resolve({ status: 200, data: result });
        }
      }).catch((err) => {
        LogError("[GET ALL CLIENTS]:error on get all clients");
        reject({ status: 500, data: err });
      });
    })
  }

  /**
   * this method is for create one client on the database (mongoDB Atlas)
   * @param {*} name 
   * @param {*} last_name 
   * @param {*} email
   * @param {*} password 
   * @returns the client created
   */
  createClient(name, last_name, email, telefono, direccion, password) {
    LogInfo("[CREATE CLIENT]: name client is " + name);
    LogInfo("[CREATE CLIENT]: last name client is " + last_name);
    LogInfo("[CREATE CLIENT]: email client is " + email);
    LogInfo("[CREATE CLIENT]: telefono client is " + telefono);
    LogInfo("[CREATE CLIENT]: direccion client is " + direccion);
    LogInfo("[CREATE CLIENT]: password client is " + password);

    return new Promise((resolve, reject) => {
      if (name && last_name && email && telefono && direccion && password) {
        encriptarPassword(password)
          .then((passwordEncripted) => {
            clienteModel.create({ name: name, last_name: last_name, email: email, telefono: telefono, direccion: direccion, password: passwordEncripted })
              .then((result) => {
                LogSuccess("[CREATE CLIENT]: response of created client perfect");
                resolve({ status: 201, data: { resgisted: true, message: "registrado correctamente", clientId: result.id } });
              })
              .catch(err => {
                console.log(err);
                LogError("[CREATE CLIENT]:error on create client");
                reject({ status: 502, data: err });
              })
          })
          .catch((err) => {
            LogError("[CREATE CLIENT]:cant encrite password of client");
            reject({ status: 500, data: err });
          });
      } else {
        LogError("[CREATE CLIENT]:Datos incompletos");
        reject({ status: 406, data: { message: "Datos incompletos" } });
      };
    })
  };


  /**
    * this method is for update one client on the database (mongoDB Atlas)
   * @param {*} id 
   * @param {*} data 
   * @returns the client updated
   */
  updateClient(id, data) {
    LogInfo("[UPDATE CLIENT]: data client is " + data);
    return new Promise((resolve, reject) => {
      if (data) {
        clienteModel
          .findByIdAndUpdate({ _id: id }, data, { rawResult: false, password: 0 })
          .then((result) => {
            LogSuccess("[UPDATE CLIENT]: response of Update client perfect");
            resolve({ status: 200, data: result });
          })
          .catch((err) => {
            LogError("[UPDATE CLIENT]:error of update client");
            reject({ status: 502, data: err });
          });
      } else {
        LogError("[UPDATE CLIENT]:data is null");
        reject({ status: 406, data: { message: "data is null" } });
      };
    })
  };


  /**
   * this method is for delete one client on the database (mongoDB Atlas)
   * @param {*} id 
   * @returns the client eliminated
   */
  deleteClient(id) {
    LogInfo("[DELETE CLIENT]: id client is " + id);
    return new Promise((resolve, reject) => {
      let allCitaOfclient = [];
      const newDatesCitadas = [];
      clienteModel.findByIdAndDelete({ _id: id }, { rawResult: true, password: 0 })
        .then((result) => {

          citaModel.find({ cliente: id })
            .then(result2 => {
              if (result2 === null || result2 === {}) {
                LogInfo("[DELETE DATE]: response when get citas of user is '{}'`");
              } else {
                allCitaOfclient = [...result2]
                console.log(allCitaOfclient);
              }
            }).catch(err => {
              LogError("[DELETE DATE]:error on the search citas of client date");
              console.log(err);
            })

          calendarioModel.findById({ _id: "636e6e17e32fb2179103b7bf" })
            .then(result3 => {
              if (result3 === null || result3 === {}) {
                LogInfo("[DELETE DATE]: response when get Calendario is '{}'`");
              } else {
                const allDateCitadas = result3.fechas_citadas;
                if (allCitaOfclient.length > 0) {
                  allCitaOfclient.forEach(c => {
                    let preNewDatesCitadas = allDateCitadas.filter(d => (d.desde.toString() !== new Date(c.desde).toString()) && (d.hasta.toString() !== new Date(c.hasta).toString()))
                    console.log(preNewDatesCitadas);
                    newDatesCitadas = [...newDatesCitadas, ...preNewDatesCitadas];
                  })
                }

              }
            }).catch(err => {
              LogError("[DELETE DATE]:error on the search Calendar for delete date");
            })

          calendarioModel.findByIdAndUpdate({ _id: "636e6e17e32fb2179103b7bf" }, { fechas_citadas: newDatesCitadas }, { rawResult: false })
            .then(respons => {
              LogSuccess("[DELETE DATE]: response at delete date of Calendar perfect");
            }).catch(err => {
              LogError("[DELETE DATE]:error at delete date of Calendar");
            })

            citaModel.find({ cliente: id })
            .then(res => {
              res.forEach(c => {
                calendarioModel.findById({ _id: "636e6e17e32fb2179103b7bf" })
                  .then(result => {
                    console.log(result.fechas_citadas, c)
                    if (result === null || result === {}) {
                      LogInfo("[DELETE DATE]: response when get Calendario is '{}'`");
                    } else {
                      const dataToSend = {};
                      const allDateBloq = result.fechas_citadas;
                      const dateToDeleteDesde = new Date(c.desde);
                      const dateToDeleteHasta = new Date(c.hasta);
                      console.log(dateToDeleteDesde);
                      console.log(dateToDeleteHasta);
                      const new_fechas_citadas = allDateBloq.filter(d => (d.desde.toString() !== dateToDeleteDesde.toString()) && (d.hasta.toString() !== dateToDeleteHasta.toString()));
                      dataToSend.fechas_citadas = new_fechas_citadas;
                      console.log(dataToSend);
                      calendarioModel.findByIdAndUpdate({ _id: "636e6e17e32fb2179103b7bf" }, dataToSend, { rawResult: false })
                        .then(respons => {
                          console.log(respons);
                          LogSuccess("[DELETE DATE]: response at delete date of Calendar perfect");
                        }).catch(err => {
                          LogError("[DELETE DATE]:error at delete date of Calendar");
                        })
                    }
                  })
                  .catch(err => {
                    LogError("[DELETE DATE]:error on the search Calendar for delete date");
                  })
              })
            })
            .catch((err) => {
              LogError("[DELETE CLIENT]:client eliminated but his all citas not");
              reject({ status: 502, data: err });
            });
          
            
          citaModel.deleteMany({ cliente: id })
            .then(res => {
              LogSuccess("[DELETE CLIENT]: response of delete client perfect");
              resolve({ status: 200, data: { message: "cliente eliminado correctamente", id: result._id } });
            })
            .catch((err) => {
              LogError("[DELETE CLIENT]:client eliminated but his all citas not");
              reject({ status: 502, data: err });
            });
        })
        .catch((err) => {
          LogError("[DELETE CLIENT]:error of delete client");
          reject({ status: 502, data: err });
        });
    })
  };


  /**
   * this method is for delete one client on the database (mongoDB Atlas)
   * @param {*} id 
   * @returns the client eliminated
   */
  deleteAllClient() {
    return new Promise((resolve, reject) => {
      clienteModel.deleteMany({})
        .then((result) => {
          citaModel.deleteMany({})
            .then((result) => {
              LogSuccess("[DELETE ALL CLIENT]: response of delete all clients perfect");
              resolve({ status: 200, data: { message: "citas eliminadas correctamente" } });
            })
            .catch((err) => {
              LogError("[DELETE ALL CLIENT]:all cliente eliminated but error of delete all citas");
              reject({ status: 502, data: err });
            });
        })
        .catch((err) => {
          LogError("[DELETE ALL CLIENT]:error of delete all client");
          reject({ status: 502, data: err });
        });
    })
  };



  /**
   * this method has the responsabliliy of create one token for de acces of client
   * @param {*} name 
   * @param {*} password 
   * @returns one token for the acces of client
   */
  loginClient(email, password) {
    LogInfo("[LOGIN CLIENT]: email client is " + email);
    LogInfo("[LOGIN CLIENT]: password client is " + password);
    return new Promise((resolve, reject) => {
      if (email && password) {
        clienteModel.findOne({ email: email })
          .then(response => {
            if (response) {
              LogInfo("[LOGIN CLIENT]:  client is " + response._id);
              comparePassword(password, response.password)
                .then(isPassword => {
                  if (isPassword) {
                    LogInfo("[LOGIN CLIENT]: isPasswor is true");
                    jwt.sign({ id: response._id }, process.env.SECRET_KEY_CLIENT, { expiresIn: "7d" },
                      (err, tok) => { tok ? resolve({ status: 200, data: { auth: true, token: tok } }) : reject({ err }) })
                  } else {
                    LogError("[LOGIN CLIENT]: isPasswor is false");
                    resolve({ status: 400, data: { message: "password is incorrect" } });
                  }
                }).catch(err => {
                  LogError("[LOGIN CLIENT]:error comparating password");
                  reject({ status: 500, data: err });
                })
            } else {
              LogError("[LOGIN CLIENT]:  client is " + response);
              resolve({ status: 400, data: { message: "email is incorrect" } });
            }
          })
          .catch(err => {
            LogError("[LOGIN CLIENT]:error on find client with name");
            reject({ status: 502, data: err });
          })
      } else {
        LogError("[LOGIN CLIENT]:password or email are null");
        reject({ status: 406, data: { message: "password or email are null" } });
      };
    })
  };
}


const clientController = new clientControllerClass();
module.exports = clientController;