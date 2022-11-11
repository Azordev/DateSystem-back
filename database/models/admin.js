const {model}=require("mongoose");
const adminSchema = require("../schemas/admin");
const adminModel=model("admin",adminSchema);
module.exports=adminModel;