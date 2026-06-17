import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectToDb from './db/db.js';
import cors from 'cors'
import userRoutes from '../Backend/routes/user.routes.js'
import captainRoutes from '../Backend/routes/captain.routes.js'
export const PORT = process.env.PORT || 5000;
import cookieParser from 'cookie-parser';


const app = express();
app.use(cors(

));
app.use(express.json())
app.use(cookieParser())
connectToDb();
app.get('/', (req, res) => {
    res.send('Hellos world!');
});
app.use('/users',userRoutes)
app.use('/captains',captainRoutes)

export default app;