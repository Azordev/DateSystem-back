const {model}=require("mongoose");
const indicacionesSchema = require("../schemas/indicaciones");
const indicacionesModel=model("indicaciones",indicacionesSchema);
module.exports=indicacionesModel;