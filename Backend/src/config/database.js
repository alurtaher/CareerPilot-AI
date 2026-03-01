const mongoose = require('mongoose')

async function connectToDb(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to DataBase`)
    }
    catch(err){
        console.log("Database not Connected "+ err)
    }
}

module.exports = connectToDb;