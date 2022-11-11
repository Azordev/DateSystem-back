const express=require("express");
const { LogInfo } = require("../utils/logger");
const clienteRouter=require("./clientes");
const citaRouter=require("./citas");
const calendarioRouter=require("./calendario");
const adminRouter=require("./admin");



const server=express();
const root = express.Router();

root.get("/",(req,res)=>{
    LogInfo("GET to princiapl Route");
    res.send("welcome to Api Of prueba for Eyerson");
})

server.use("/",root);
server.use("/clientes",clienteRouter);
server.use("/citas",citaRouter);
server.use("/calendarios",calendarioRouter);
server.use("/admins",adminRouter);


module.exports=server;