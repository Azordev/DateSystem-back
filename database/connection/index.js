const mongoose=require("mongoose");
const {LogError,LogSuccess}=require("../../utils/logger");
const uri=process.env.URI_CONECT;


mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true})
.then(res=>LogSuccess("[MongoDB conection]: running"))
.catch(err=>LogError(err));