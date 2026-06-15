import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

export const PORT = process.env.PORT || 5000;

const app = express();

export default app;