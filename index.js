const dotenv = require(`dotenv`);
dotenv.config();
const server= require("./server");
const {LogError, LogSuccess} = require("./utils/logger");

const PORT = process.env.PORT || 8080;

server.listen(PORT,()=>LogSuccess(`[server on]:running in http://localhost:${PORT}/api`));

server.on('error',(error)=>{
    LogError(error);
})