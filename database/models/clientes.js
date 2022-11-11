const {model}=require("mongoose");
const clienteSchema = require("../schemas/clientes");
const clienteModel=model("clientes",clienteSchema);
module.exports=clienteModel;