# Sistema de Gestión de Instaladores

Este proyecto es una aplicación web para la **gestión y distribución de instaladores de software**.  
Está desarrollada con **Node.js, Express y PostgreSQL (usando Sequelize ORM)** para el backend,  
y un **frontend en React con Vite** que consumirá los endpoints documentados con **Swagger**.

---

## Características principales

- Registro e inicio de sesión de usuarios con JWT.
- Roles de usuario: `admin` y `usuario`.
- CRUD completo de **aplicativos**.
- Subida, descarga y gestión de **instaladores** asociados a aplicativos.
- Actualización automática de la versión del aplicativo al subir un nuevo instalador.
- Buscador en tiempo real en las pantallas de: consulta de aplicativos, gestión de aplicativos y gestión de instaladores.
- Interfaz moderna y responsiva con TailwindCSS.
- Protección de rutas con autenticación y autorización.
- Eliminación automática de archivos asociados al borrar aplicativos o instaladores.
- Documentación interactiva con **Swagger UI**.

---

## Tecnologías utilizadas

| Componente | Tecnología |
|-------------|-------------|
| **Backend** | Node.js + Express |
| **ORM** | Sequelize |
| **Base de datos** | PostgreSQL |
| **Autenticación** | JWT + bcryptjs |
| **Subida de archivos** | Multer |
| **Frontend** | React + Vite |
| **Estilos** | TailwindCSS |
| **Documentación** | Swagger (swagger-jsdoc + swagger-ui-express) |
| **Logging** | Morgan |
| **Variables de entorno** | dotenv |

---

## Instalación 

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/instaladores-app.git
```

### Configuración del backend
```bash
cd instaladores-app/backend
```

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno

### 3. Migrar base de datos
```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

### 4. Ejecutar servido
```bash
npm run dev
```

### 5. Donde encontrar la documentacion
http://localhost:ServerPort/api/docs

### Configuración del frontend
```bash
cd instaladores-app/frontend
```

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno

### 3. Ejecutar servido
```bash
npm run dev
```

### 5. Donde encontrar el servidor funcionando
http://localhost:ServerPort/