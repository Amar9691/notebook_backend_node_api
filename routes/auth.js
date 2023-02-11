const express = require('express');
const router = express.Router();
const User  = require('../models/User');
const {body, validationResult} = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const authmiddleware = require('../middleware/authmiddleware')

router.post('/signup',[
    
       body('name','Enter Valid Name').isLength({min:4}),
       body('email','Enter Valid Email').isEmail(),
       body('password','Password Must be 8 characters long').isLength({min:8})
       
], async (req,res)=>{
      let success = false;
      const valid = validationResult(req);
      if(!valid.isEmpty())
      {
          return res.status(400).json({errors:valid.array()});
      }
     
      let user = await User.findOne({email:req.body.email});
      
      try{

        if(user)
        {
           console.log(user);
           return res.status(400).json({error:"User already exits"});
        }
        else
        {
          var salt =  await bcrypt.genSaltSync(10);
          var hash = await bcrypt.hashSync(req.body.password, salt);
           user  = await User.create({
                
              name:req.body.name,
              email:req.body.email,
              password:hash
      
            });
            
            const data = {
              user:{
                id:user.id
              }
            }

            const JWT_SECRET = 'This is my Sigature';

            const authToken = jwt.sign(data, JWT_SECRET);

            success = true;
             
            return res.status(200).json({authToken,success:success});
  
        }

      }catch(error){

          console.error(error.message);

          return res.status(500).send("Something Went Wrong! Please Contact With Support Team");
      }


     

   

});


router.post('/login',[

  body('email','Please Enter Valid Email').isEmail(),
  body('password','Please Enter Password').exists()
], async (req,res)=>{
      
     let success = false;
     const error = validationResult(req);
     if(!error.isEmpty())
     {
         return res.status(500).json({error:error.array()});
     }
     else
     {
        const {email, password} = req.body;

        try{
          
          let user = await User.findOne({email:email});

          if(!user)
          {
              return res.status(400).json({error:"Invalid Credentials",success:success});
          }
          else
          {
              const comparePassword = await bcrypt.compareSync(password,user.password);
             
              if(!comparePassword)
              {
                return res.status(400).json({error:"Invalid Credentials",success:success});
              }
              else{
                       
               const data = {
                    user:{
                      id:user.id,
                    }
               
               }
               success = true;
               const JWT_SECRET = 'This is my Sigature';
               const authToken =  jwt.sign(data,JWT_SECRET);


               return res.status(200).json({authToken,success:success});
              }

              

              
          }

        }
        catch(error)
        {
          console.error(error.message);

          return res.status(500).send("Something Went Wrong! Please Contact With Support Team");
            
        }
     }

    
});

router.post('/user_details',authmiddleware,async(req,res)=>{
  

     try{
          
          userid = req.user.id; 
          const user = await User.findById(userid).select('-password');

          if(!user)
          {
              return res.status(200).send({user:"Not Details found"});
          }
          else
          {
             return res.status(200).send({user:user});
          }

     }catch(error)
     {    

           return res.status(500).send({error:"Something Went Wrong"});

     } 
    

});


module.exports = router;