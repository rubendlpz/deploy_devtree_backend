# DevTree · Backend

API REST de DevTree, una plataforma para reunir tus redes sociales en un solo enlace público.

Interfaz web: [deploy_devtree_frontend](https://github.com/rubendlpz/deploy_devtree_frontend)

## Funcionalidades

- Registro e inicio de sesión con contraseñas cifradas (bcrypt)
- Autenticación con JSON Web Tokens
- Handles únicos y normalizados
- Edición de perfil y enlaces
- Carga de imágenes a Cloudinary
- Consulta de perfiles públicos sin exponer correo ni contraseña
- CORS restringido al origen del frontend

## Tecnologías

Node.js · Express 5 · TypeScript · MongoDB (Mongoose) · JWT · bcrypt · express-validator · Formidable · Cloudinary · Docker

## Instalación

Requisitos: Node.js 24, una base de datos MongoDB y una cuenta de Cloudinary.

```bash
git clone https://github.com/rubendlpz/deploy_devtree_backend.git
cd deploy_devtree_backend
npm install
```

Crea el archivo `.env`:

```env
URL_BD=mongodb://localhost:27017/devtree
FRONTEND_URL=http://localhost:5173
JWT_SECRET=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Inicia el servidor en `http://localhost:4000`:

```bash
npm run dev
```

Para probar la API desde herramientas sin cabecera `Origin` (Postman, Bruno, curl):

```bash
npm run dev:api
```

### Con Docker

```bash
docker compose up --build
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Desarrollo con recarga automática |
| `npm run dev:api` | Desarrollo permitiendo peticiones sin `Origin` |
| `npm run build` | Compilación de TypeScript |
| `npm start` | Ejecuta la compilación |

## Endpoints

Las rutas protegidas requieren la cabecera `Authorization: Bearer <token>`.

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/auth/register` | No | Crea una cuenta (`handle`, `name`, `email`, `password` de 8 caracteres o más) |
| `POST` | `/auth/login` | No | Devuelve el token (`email`, `password`) |
| `GET` | `/user` | Sí | Usuario autenticado |
| `PATCH` | `/user` | Sí | Actualiza `handle`, `description` y `links` |
| `POST` | `/user/image` | Sí | Sube la imagen de perfil (`multipart`, campo `file`) |
| `GET` | `/:handle` | No | Perfil público |
| `POST` | `/search` | No | Indica si un `handle` está disponible |

## Estructura

```
src/
├── config/       # Base de datos, CORS y Cloudinary
├── handler/      # Lógica de cada endpoint
├── middleware/   # Autenticación y validación
├── models/       # Modelo de usuario
├── utils/        # Contraseñas y JWT
├── router.ts     # Rutas y reglas de validación
├── server.ts     # Configuración de Express
└── index.ts      # Punto de entrada
```

## Autor

Rubén López · [@rubendlpz](https://github.com/rubendlpz)
