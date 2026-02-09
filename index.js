import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload';

import authRoute from "./routes/auth.js";
import postRoute from "./routes/posts.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
// // Constants
const PORT = process.env.PORT || 3001;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static files (картинки)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

// start server
// const PORT = process.env.PORT || 3002;
async function  start(){
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@myclusterfortest.evvrx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=MyClusterForTest`
        )
        app.listen(PORT, ()=>{
               console.log(`Server started on port ${PORT}`)
        })
        
    } catch (error) {
        console.error("Server error:", error.message);
    }
}
start();
