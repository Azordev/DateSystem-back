const {model}=require("mongoose");
const calendarioSchema = require("../schemas/calendario");
const calendarioModel=model("calendario",calendarioSchema);
module.exports=calendarioModel;