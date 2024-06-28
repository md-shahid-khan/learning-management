import mongoose, {mongo} from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const DATABASE_URL: string = process.env.DATABASE_URL2 || " ";

export const connectToDb = async () => {
    try {
        const response = await mongoose.connect(DATABASE_URL).then((data: any) => {
            console.log(`DATABASE is connected to the PORT ${data.connection.host}`)
        });


    } catch (error: any) {
        console.log("errors in connecting to the database", error.message);
        return;

    }
}

export default connectToDb;