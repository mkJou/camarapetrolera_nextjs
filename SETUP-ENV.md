# Configuración de Variables de Entorno

Para que la aplicación funcione correctamente, necesitas crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

## Crear archivo .env

Crea un archivo llamado `.env` en la raíz del proyecto (mismo nivel que package.json) con el siguiente contenido:

```env
# Base de datos MongoDB
MONGODB_URI=mongodb+srv://root:NQ9vaoWpiMm1lFlA@cluster0.m4fyvrj.mongodb.net/camaranuevo?retryWrites=true&w=majority
DB_NAME=camaranuevo

# JWT Secret para autenticación (cambiar en producción)
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_cambiar_en_produccion

# Configuración de Resend para correos
RESEND_API_KEY=re_MjYE7DF5_HxPNURmP2pPi4Mopdekw6RjC
EMAIL_FROM=notificaciones@smartworld.com.ve

# URL base de la aplicación
NEXTAUTH_URL=http://localhost:3000

# Ambiente de desarrollo
NODE_ENV=development
```

## Importante ⚠️

- **NUNCA** subas el archivo `.env` al repositorio Git
- El archivo `.env` ya está en `.gitignore` para proteger las credenciales
- En producción, cambia `JWT_SECRET` por un valor único y seguro
- Actualiza `NEXTAUTH_URL` con el dominio de producción

## Verificación

Después de crear el archivo `.env`:

1. Reinicia el servidor: `npm run dev`
2. Verifica que no haya errores de conexión a la base de datos
3. Prueba el login y recuperación de contraseña

## Variables explicadas

- `MONGODB_URI`: Conexión a la base de datos MongoDB
- `DB_NAME`: Nombre de la base de datos
- `JWT_SECRET`: Clave secreta para firmar tokens JWT
- `RESEND_API_KEY`: API key de Resend para envío de correos
- `EMAIL_FROM`: Email desde el cual se envían las notificaciones
- `NEXTAUTH_URL`: URL base de la aplicación
- `NODE_ENV`: Ambiente de ejecución (development/production)
