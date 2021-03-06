const mongoose=require('mongoose');
const config=require('config');
const db=config.get('mongoURI')

const connectDB=async ()=>{
    const conn=await mongoose.connect( db ,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology:true
    });
    console.log(`mongoDB connected: ${conn.connection.host}`);

}

module.exports=connectDB;