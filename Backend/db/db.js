import mongoose from "mongoose";



function connectToDb() {
    mongoose.connect(process.env.DB_CONNECT)
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => {
            console.log("MongoDB connection error:", err);
        });
}


export default connectToDb;