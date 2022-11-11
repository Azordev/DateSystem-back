const {model}=require("mongoose");
const citaSchema = require("../schemas/citas");
const citaModel=model("citas",citaSchema);
module.exports=citaModel;