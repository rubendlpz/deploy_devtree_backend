import { Router } from "express";
import { body } from "express-validator";
import {
  createCuenta,
  login,
  getUser,
  updateProfile,
  uploadImage,
  getUserByHandle,
  searchByHandle,
} from "./handler/index";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";
const router = Router();

/*Registro */

router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El handle no puede ir vacío"),
  body("name").notEmpty().withMessage("El nombre no puede ir vacío"),
  body("email").isEmail().withMessage("Email no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password  es muy corto. Mínimo 8 caracteres."),
  handleInputErrors,
  createCuenta,
);
/*Autenticación*/
router.post(
  "/auth/login",
  body("email").isEmail().withMessage("Email no válido."),
  body("password").notEmpty().withMessage("El password  es obligatorio."),
  handleInputErrors,
  login,
);

router.get("/user", authenticate, getUser);

router.patch(
  "/user",
  body("handle").notEmpty().withMessage("El handle no puede ir vacío."),
  body("description")
    .isString()
    .withMessage("La descripcion debe ser texto."),
  handleInputErrors,
  authenticate,
  updateProfile,
);

router.post("/user/image", authenticate, uploadImage);

router.get("/:handle", getUserByHandle);

router.post(
  "/search",
  body("handle").notEmpty().withMessage("El handle no puede ir vacío."),
  handleInputErrors,
  searchByHandle,
);

export default router;
