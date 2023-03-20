const { Schema } = require("mongoose");

const indicacionesSchema = new Schema({
  data:{
    type: String,
    min: 5,
  },
  observacion:{
    type: String,
    min: 5,
  },
  date:{
    type:Date,
    require:true,
    default:new Date()
  },
  cliente:{
    type: Schema.Types.ObjectId,
    ref:"clientes",
    require:true
  }
})

indicacionesSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

module.exports = indicacionesSchema;