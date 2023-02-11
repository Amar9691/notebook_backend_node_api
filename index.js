const mongo = require('./db');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
mongo();

app.use(cors());
app.use(express.json());
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/note'));

app.listen(port,()=>{
    console.log("Connection Established");

});
