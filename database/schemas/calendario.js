const { Schema } = require("mongoose");

const calendarioSchema = new Schema({
  fechas_citadas: [{
    type: Date,
    max: 50,
    min: 5,
  }],
  fechas_bloqueadas:[{
    type: Date,
    max: 25,
    min: 5,
  }],
})

calendarioSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    delete password
  }
})

module.exports = calendarioSchema;