const { Schema } = require("mongoose");
const clienteSchema = new Schema({
  name:{
    type: String,
    min: 5,
    required: true,
  },
  last_name:{
    type: String,
    min: 5,
    required: true,
  },
  email: {
    type: String,
    min: 5,
    required: true,
    unique: true
  },
  telefono:{
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    match: /(?=.*[a-zA-Z])(?=.*[0-9]+).*/,
    required: true,
    min: 8
  },
  citas: [{
    type: Schema.Types.ObjectId,
    ref:"citas"
  }],
  indicaciones: [{
    type: Schema.Types.ObjectId,
    ref:"indicaciones"
  }]
})

clienteSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    delete password
  }
})

module.exports = clienteSchema;