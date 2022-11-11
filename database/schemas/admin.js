const { Schema } = require("mongoose");

const adminSchema = new Schema({
    name: {
        type: String,
        max: 15,
        min: 5,
        required: true,
      },
      last_name: {
        type: String,
        max: 15,
        min: 5,
        required: true,
      },
      email: {
        type: String,
        max: 50,
        min: 5,
        required: true,
        unique: true
      },
      password: {
        type: String,
        match: /(?=.*[a-zA-Z])(?=.*[0-9]+).*/,
        required: true,
        min: 8
      }
})

adminSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    delete password
  }
})

module.exports = adminSchema;