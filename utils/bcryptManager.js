const bcrypt = require("bcrypt");

const encriptarPassword=(password)=>{
    return bcrypt.hash(password, 10);
}

const comparePassword=(password,passwordUser)=>{
    return bcrypt.compare(password,passwordUser);
}

module.exports={encriptarPassword,comparePassword}