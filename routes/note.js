const express = require('express');
const router = express.Router();
const authmiddleware = require('../middleware/authmiddleware')
const Note  = require('../models/Note');
const {body, validationResult} = require('express-validator');



router.get('/getallnotes',authmiddleware,async(req,res)=>{
      
    try{
         
          const notes = await Note.find({user:req.user.id});
          return res.json(notes);

    }
    catch(error)
    {
        res.status(500).send({error:"Something Went Wrong!"});
    }

});

router.post('/storenotes',[
     
    body('title','Enter Valid Title').isLength({min:5}),
    body('description').isLength({min:25}),
    body('tag').isLength({min:2})
     
    ],authmiddleware,async(req,res)=>{
      
    try{
         
       const error = validationResult(req);
       if(!error.isEmpty())
       {
            return res.stats(400).json({error:error.array()});
       }

        const note = Note.create({
                user:req.user.id,
                title:req.body.title,
                description:req.body.description,
                tag:req.body.tag
               });
       

       return res.status(200).send({message:"Note created successfully"});
        

    }
    catch(error)
    {
        res.status(500).send({error:"Something Went Wrong!"});
    }

});


router.get('/editnoteinfo/:id', authmiddleware, async(req,res)=>{
     
      try{

        const note = await Note.findById(req.params.id);

         if(!note)
         {
            return res.status(404).send({error:"Not found"});   
         }

         if(req.user.id == note.user.toString())
         {
            const  notes =  await Note.findById(req.params.id);
             return res.status(200).send(notes);

         }
         else
         {
            return res.status(401).send({error:"unauthenticated"});
         }


      }
      catch(error)
      {
          res.status(500).send({error:"Something Went Wrong!"});
      }

});

router.put('/updatenotes/:id',authmiddleware,async(req,res)=>{

    try{
         
         const {title,description,tag} = req.body;
         const newnotes = {};

         if(title)
         {
            newnotes.title = title;
         }
         if(description)
         {
            newnotes.description = description;
         }
         if(tag)
         {
            newnotes.tag = tag;
         }
         
         const note = await Note.findById(req.params.id);

         if(!note)
         {
            return res.status(404).send({error:"Not found"});   
         }

         if(req.user.id == note.user.toString())
         {
            const  notes =  await Note.findByIdAndUpdate(req.params.id,{$set:newnotes},{new:true});

             return res.status(200).send(notes);

         }
         else
         {
            return res.status(401).send({error:"unauthenticated"});
         }

 
     }
     catch(error)
     {
         res.status(500).send({error:"Something Went Wrong!"});
     }
 

});


router.get('/delete_notes/:id',authmiddleware,async(req,res)=>{

       try{
            const note  = await Note.findById(req.params.id);
            if(!note)
            {
                  return res.status(404).send({error:"Note not found"});
            }

            if(req.user.id != note.user.toString())
            {
                  return res.status(401).send({error:"Unauthorized"});
            }

             const del = await Note.findByIdAndDelete(req.params.id);
            
            return res.status(200).send({success:"Note Removed Successfully"});


       }catch(error)
       {
           return res.status(500).send({error:"Something Went Wrong"});
       }

});

module.exports = router;