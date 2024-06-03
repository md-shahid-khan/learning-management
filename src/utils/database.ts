import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const DATABASE_URL: string = process.env.DATABASE_URL2 || " ";

export const connectToDb = async () => {
    try {
        const response = await mongoose.connect(DATABASE_URL);
        console.log(`database connected on ${response.connection.host}`);


    } catch (err: any) {
        console.log(err.message)
        setTimeout(connectToDb, 5000)
    }
}

export default connectToDb;
