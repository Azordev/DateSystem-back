const { Schema } = require("mongoose");

const calendarioSchema = new Schema({
  fechas_citadas: [{
    desde:{
      type: Date
    },
    hasta:{
      type: Date
    }
  }],
  fechas_bloqueadas:[{
    desde:{
      type: Date
    },
    hasta:{
      type: Date
    }
  }],
})

calendarioSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

module.exports = calendarioSchema;