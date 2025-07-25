import express from "express";
import router from "./routes/auth.routes.js";
import noteRouter from './routes/note.routes.js'
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express();

app.use(express.json());

app.use(cookieParser()); 
app.use(cors({
  origin: 'http://localhost:6000', 
  credentials: true,               
}));
app.use('/api/v1/users',router)
app.use('/api/v1/notes',noteRouter)

export default app;