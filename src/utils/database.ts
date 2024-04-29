import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const database_url:string = process.env.DATABASE_URL2 || " ";

export const connectToDb = async ()=>{
    try{
        await mongoose.connect(database_url).then((data:any)=> console.log(`database connected on ${data.connection.host}`)).catch((err)=> console.log(err));
    }catch (err:any){
        console.log(err.message)
        setTimeout(connectToDb, 5000)
    }
}

export default connectToDb;
