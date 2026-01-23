// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";

// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';

// import authRoute from "./routes/auth.js";
// import postRoute from "./routes/posts.js";
// import { checkAuth } from "./utils/checkAuth.js";

// const app = express();
// dotenv.config();

// const storage = multer.diskStorage({
//   destination: (_, __, cb) => {
//     cb(null, 'uploads');
//   },
//   filename: (_, file, cb) => {
//     const ext = path.extname(file.originalname);  
//     const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, fileName + ext);                  // сохраняется только в латинице
//   },
// });

// export const upload = multer({ storage });


// // Middleware
// app.use(express.json());
// app.use(cors());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ВАЖНО: раздача статических файлов
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// // ДО app.listen().

// // Constants
// const PORT = process.env.PORT || 3001;
// const DB_USER = process.env.DB_USER;
// const DB_PASSWORD = process.env.DB_PASSWORD;
// const DB_NAME = process.env.DB_NAME;

// app.get('/', (req, res)=>{
//    return  res.json({ message: "All is fine"})
// });

// // Routes
// app.use('/api/auth', authRoute )
// app.use('/api/posts', postRoute )

// // app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);

// async function  start(){
//     try {
//         await mongoose.connect(
//             `mongodb+srv://${DB_USER}:${DB_PASSWORD}@myclusterfortest.evvrx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=MyClusterForTest`
//         )
//         app.listen(PORT, ()=>{
//                console.log(`Server started on port ${PORT}`)
//         })
        
//     } catch (error) {
//         console.error("Server error:", error.message);
//     }
// }
// start();


import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

import authRoute from "./routes/auth.js";
import postRoute from "./routes/posts.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

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
// start();
// async function start() {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     app.listen(PORT, () => {
//       console.log(`Server started on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error('Server error:', error);
//   }
// }

start();
