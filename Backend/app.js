import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectToDb from './db/db.js';
import cors from 'cors'
import userRoutes from '../Backend/routes/user.routes.js'
export const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors(

));
app.use(express.json())
connectToDb();
app.get('/', (req, res) => {
    res.send('Hellos world!');
});
app.use('/users',userRoutes)


export default app;