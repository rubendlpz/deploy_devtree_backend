import express from "express"; //ESM
import router from './router'; 
import {connectDB} from './config/db';
import cors from 'cors';
import 'dotenv/config'; 
import { corsConfig } from "./config/cors";
//Conexión a BD
connectDB();
//Crear instancia de express/servidor
const app = express();

//Cors
app.use(cors(corsConfig));
//Leer datos de formulario
app.use(express.json());

app.use('/', router);

export default app;
