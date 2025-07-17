import express from "express";
import router from "./routes/auth.routes.js";


const app = express();
app.use(express.json());

app.use('/api/v1/users',router)
export default app;