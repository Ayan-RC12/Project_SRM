const express=require('express');
const morgan = require("morgan");
const connectDB = require('./config/db');
const conectDB=require('./config/db') 
const path=require('path');


const app=express();

// connect to database
connectDB();

// init middleware
app.use(express.json({ extended: false }));


// server static assests in production
if(process.env.NODE_ENV==='production'){
    // set static folder
    app.use(express.static('client/build'));

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    })
}

const PORT=process.env.PORT || 5000;

app.use(morgan('dev'));


// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));



app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));