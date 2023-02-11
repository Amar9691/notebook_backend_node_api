const jwt = require('jsonwebtoken');
const JWT_SECRET = 'This is my Sigature';

const verify = (req,res,next)=>{

      const token = req.header('auth-token');
      if(!token)
      {
            res.status(400).send({error:'Unauthenticated'});
      }

      try{
           const  verifytoken = jwt.verify(token, JWT_SECRET);
           req.user = verifytoken.user;
           next();
      }
      catch(error)
      {
          res.status(400).send({error:'Unauthenticated'});
          
      }
     

}


module.exports = verify;