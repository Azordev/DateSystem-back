const { Schema } = require("mongoose");

const citaSchema = new Schema({
  motivo: {
    type: String,
    max: 50,
    min: 5,
    required: true,
  },
  desde:{
    type:Date,
    require:true
  },
  hasta:{
    type:Date,
    require:true
  },
  costo:{
    type: String,
    max: 25,
    min: 5,
    default:"PESO"
  },
  moneda:{
    type: Number
  },
  status:{
    type: String,
    max: 25,
    min: 5,
    default:"espera"
  },
  cliente:{
    type: Schema.Types.ObjectId,
    ref:"clientes",
    require:true
  }
})

citaSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

module.exports = citaSchema;