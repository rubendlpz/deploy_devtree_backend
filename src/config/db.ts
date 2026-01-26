import colors from "colors";
import mongoose from "mongoose";
import User, {IUser} from "../models/User"
export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.URL_BD);
    const url2 = `${connection.host}:${connection.port}`;
    console.log(colors.green.bold(`Conectado a la BD en ${url2}`));
  } catch (error) {
    console.log(colors.red(`error: ${error.message}`));
    process.exit(1); //Terminar el proceso con error
  }
};
