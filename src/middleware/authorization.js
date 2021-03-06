const jwt = require("jsonwebtoken"); 
const { AUTH_SIGN
    } = process.env;

module.exports = (credentials=[])=>{
    return(req,res, next) =>{
        //Allow for a string OR array 
            if(typeof credentials ==="string"){
                credentials = [credentials];
            }
            //Find JWT in headers
            const token  =req.headers["authorization"];
            if(!token){
                return res.status(401).send({error:"No existe el token"})
            } else {
                const tokenBody = token.slice(7);
                jwt.verify(tokenBody, '123456', (err, decoded)=>{
                    if(err){
                        console.log(`JWT Error: ${err}`);
                        return res.status(401).send({error:"error de token"})
                    }
                    //No error
                    //Check for credentials
                    if(credentials.length>0){
                        if (
                            decoded.scopes &&
                            decoded.scopes.length &&
                            credentials.some(cred => decoded.scopes.indexOf(cred) >= 0)
                            ){
                                next();
                            } else {
                                return res.status(401).send({error:"Credenciales no validas"})
                            }
                    } else {
                        return res.status(401).send({error:"NO hay credenciales"})
                            
                    }
                })
            }
    }

}