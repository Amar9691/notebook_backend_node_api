const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost:27017/notebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
const connectMongo = ()=>{
    
      mongoose.connect(mongoUri,()=>{
              
        console.log("Yes! I am connect To MongoDB");
           
      });

}

module.exports = connectMongo;