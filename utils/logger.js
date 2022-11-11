class Logger{
    
    /**
     * controla las informaciones para, tener un contror de que esta
     * pasando en nuestro servidor
     */
    LogInfo (message){console.log(`Info: ${message}`)}

    /**
     * contola cuando ha sucedido correctamente,
     * ya sea na petcion, una funcion o cualquier otra accion
     */
    LogSuccess (message){console.log(`Success: ${message}`)}

    /**cntrola los warning en caso de halla */
    LogWarning (message){console.log(`Warning: ${message}`)}

    /**
     *controla los errores en caso de que alguna accion(funcion o peticion, etc)
     *dispare algun error 
    */
    LogError(message){console.log(`Error: ${message}`)}
}

const logger = new Logger();

module.exports=logger;