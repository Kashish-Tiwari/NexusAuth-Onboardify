const jwt = require('jsonwebtoken');
const {Op } = require('sequelize');
const clients = require('../../config/db').clients;





exports.createJwtTokenClient = async (client_id, phone,remember_key, isComplete) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        client_id: client_id,
        phone: phone,
        remember_key:remember_key,
        isComplete: isComplete
    }
    const token = await jwt.sign(data, jwtSecretKey,{
        expiresIn:'7d' ,
        algorithm  : 'HS256'
       });
    return token
}

exports.decodeJwtTokenClient = async (req, res, next) =>
    {
       try 
       {
   
       console.log("=====================Request Start==============================")
       console.log(req.method, req.route.path, req.originalUrl)
       console.log('Body :', req.body)
       console.log('Params :', req.params)
       console.log('Query :', req.query)
       console.log('Header :', req.headers)
       console.log("=====================Request End==============================")
   
   
       if (req.headers.authorization && req.headers.authorization !== "null") 
       {   console.log(req.headers.authorization, 'authorization');
               let tokenParts = req.headers.authorization.split(" ");
               let token;
                 console.log(token, 'token 2');
               if (tokenParts.length > 1 && tokenParts[0].toLowerCase() === "bearer") 
               {
                   // The format is "Bearer [token]"
                   token = tokenParts[1];
               } 
               else 
               {
                   // It's possibly just the token
                   token = tokenParts[0];
               }
               console.log(token, 'token12');
               token = token.trim();
               console.log(token, 'token14');
               const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
               console.log("-----------", decoded);
   
           
               const clientFind = await clients.findOne({
                 where: {
                   id: decoded.client_id,
                   remember_key: decoded.remember_key || null,
                   deleted_at: { [Op.is]: null },
                 },
               });
   
               if (clientFind){
                   req.client = clientFind;
                   next();
               } 
               else 
               {
                   return res.status(400).json({
                       status: false,
                       message: "Token is Invalid",
                   });
               }
           } 
           else 
           {
               return res.status(400).json({
                   status: false,
                   message: "Token is required",
               });
           }   
           
           }
            catch (error) 
           {
               console.log(error.message)
               return res.status(400).json({
                   status: false,
                   message: error.message
               });
           }
   };
