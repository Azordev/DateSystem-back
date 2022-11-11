const { Schema } = require("mongoose");

const citaSchema = new Schema({
  motivo: {
    type: String,
    max: 50,
    min: 5,
    required: true,
  },
  date: {
    type: Date,
    require:true
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
    delete password
  }
})

module.exports = citaSchema;