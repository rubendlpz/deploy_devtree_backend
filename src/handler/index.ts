import type { Request, Response } from "express";
import slug from "slug";
import formidable from "formidable";
import cloudinary from "../config/cloudinary";
import { v4 as uuid } from "uuid";
import { validationResult } from "express-validator";
import User from "../models/User";
import { hashedPassword, checkPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";

export const createCuenta = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const handle = slug(req.body.handle, "");
  const handleExists = await User.findOne({ handle });
  if (handleExists) {
    const error = new Error("Nombre de usuario no disponible.");
    return res.status(409).json({ error: error.message });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error("Usuario ya está registrado");
    return res.status(409).json({ error: error.message });
  }
  const user = new User(req.body);
  user.password = await hashedPassword(password);
  user.handle = handle;
  await user.save();
  res.status(201).send({ msg: "Registro creado correctamente" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  //Comprobar si el usuario existe
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("El usuario no existe.");
    return res.status(401).json({ error: error.message });
  }
  //Comprobar password
  const comprobarPassword = await checkPassword(password, user.password);
  if (!comprobarPassword) {
    const error = new Error("Password Incorrecto.");
    return res.status(401).json({ error: error.message });
  }
  const token = generateJWT({ id: user.id });

  return res.send(token);
};

export const getUser = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { description, links } = req.body;
    const handle = slug(req.body.handle, "");
    const handleExists = await User.findOne({ handle });

    if (handleExists && handleExists.email !== req.user.email) {
      const error = new Error("Nombre de usuario no disponible.");
      return res.status(409).json({ error: error.message });
    }
    //Actualizar usuario
    req.user.description = description;
    req.user.handle = handle;
    req.user.links = links;

    await req.user.save();

    res.send("Usuario actualizado correctamente.");
  } catch (e) {
    const error = new Error("Hubo un error.");
    res.status(500).json({ error: error.message });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const form = formidable({ multiples: false });
    form.parse(req, (error, fields, files) => {
      cloudinary.uploader.upload(
        files.file[0].filepath,
        { public_id: uuid() },
        async function (error, result) {
          if (error) {
            const error = new Error("Ocurrio un error al cargar la imagen.");
            res.status(500).json({ error: error.message });
          }
          if (result) {
            req.user.image = result.secure_url;
            await req.user.save();
            res.json({
              image: result.secure_url,
            });
          }
        },
      );
    });
  } catch (e) {
    const error = new Error("Hubo un error.");
    res.status(500).json({ error: error.message });
  }
};

export const getUserByHandle = async (req: Request, res: Response) => {
  try {
    const { handle } = req.params;
    const user = await User.findOne({ handle }).select(
      "-_id -__v -email -password",
    );
    console.log(user);
    if (!user) {
      const error = new Error("El usuario no existe.");
      return res.status(404).json({ error: error.message });
    }
    return res.json(user);
  } catch (e) {
    const error = new Error("Hubo un error.");
    res.status(500).json({ error: error.message });
  }
};

export const searchByHandle = async (req: Request, res: Response) => {
  try {
    console.log(req.body.handle);
    const { handle } = req.body;
    const userExists = await User.findOne({ handle });
    if (userExists) {
      const error = new Error(`${handle} ya esta registrado`);
      return res.status(409).json({ error: error.message });
    }

    res.send(`${handle} esta disponible`);
  } catch (e) {
    const error = new Error("Hubo un error.");
    res.status(500).json({ error: error.message });
  }
};
