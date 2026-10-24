# VetConnect API: MongoDB en Docker + NestJS

Actividad práctica de **Desarrollo Web y Móvil** (Semana 11). Una API REST hecha con NestJS que guarda mascotas en una base de datos MongoDB ejecutada en Docker con almacenamiento persistente.

## Arquitectura

```
React (5173) → API REST NestJS (3000) → Mongoose → MongoDB en Docker (27017) → volumen mongodb_data
```

React nunca se conecta directamente a MongoDB: siempre pasa por la API.

## Tecnologías

- Node.js y NestJS 10
- Mongoose (`@nestjs/mongoose`) y `@nestjs/config`
- MongoDB 8.0 (imagen oficial `mongo:8.0`)
- Docker Desktop

## Requisitos

- Docker Desktop funcionando (`docker --version` y `docker info` sin errores)
- Node.js y npm
- Opcional: MongoDB Compass

## Estructura del proyecto

```
vetconnect-api/
├── .env.example          # plantilla de variables de entorno (sin claves reales)
├── .gitignore
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── src/
    ├── main.ts           # arranque, puerto 3000, CORS para React
    ├── app.module.ts     # conexión a MongoDB con ConfigModule + Mongoose
    └── mascotas/
        ├── mascotas.module.ts
        ├── mascotas.controller.ts
        ├── mascotas.service.ts
        └── schemas/
            └── mascota.schema.ts
```

## Parte A. Levantar MongoDB en Docker

1. Descargar la imagen:

   ```bash
   docker pull mongo:8.0
   ```

2. Crear el volumen donde se guardarán los datos:

   ```bash
   docker volume create mongodb_data
   ```

3. Iniciar el contenedor (reemplaza `<TU_CLAVE>` por una contraseña de laboratorio):

   ```bash
   docker run -d --name mongodb-dev \
     -p 127.0.0.1:27017:27017 \
     -e MONGO_INITDB_ROOT_USERNAME=admin \
     -e MONGO_INITDB_ROOT_PASSWORD=<TU_CLAVE> \
     -v mongodb_data:/data/db \
     --restart unless-stopped \
     mongo:8.0
   ```

   - `-p 127.0.0.1:27017:27017` publica el puerto solo en el equipo local.
   - `-v mongodb_data:/data/db` guarda los datos en el volumen, fuera del contenedor.

4. Verificar que está corriendo:

   ```bash
   docker ps
   ```

**Evidencia 1: contenedor en ejecución**

![docker ps](evidencias/01-docker-ps.png)

## Parte B. Explorar y modificar documentos (mongosh)

Entrar a la consola de MongoDB dentro del contenedor:

```bash
docker exec -it mongodb-dev mongosh -u admin -p <TU_CLAVE> --authenticationDatabase admin
```

En Git Bash para Windows se debe anteponer `winpty` al comando.

Crear, consultar, actualizar y borrar documentos:

```js
use vetconnect_db
db.mascotas.insertOne({nombre:"Luna", especie:"Gato", edad:2, vacunado:true})
db.mascotas.insertOne({nombre:"Rocky", especie:"Perro", edad:4, vacunado:false})
db.mascotas.find()
db.mascotas.find({especie:"Perro"})

db.mascotas.updateOne({nombre:"Rocky"}, {$set:{edad:5}})
db.mascotas.deleteOne({nombre:"Luna"})
db.mascotas.find()
```

- `insertOne` crea un documento; MongoDB crea la base y la colección al guardar el primer dato.
- `updateOne` recibe un filtro y, con `$set`, los campos que se modifican.
- `deleteOne` borra el primer documento que coincida con el filtro.

**Evidencia 2: colección en mongosh**

![mongosh](evidencias/02-mongosh.png)

## Parte C. Conectar NestJS con MongoDB

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear el archivo `.env` a partir de la plantilla y completar la clave:

   ```bash
   cp .env.example .env
   ```

   ```
   MONGODB_URI=mongodb://admin:<TU_CLAVE>@localhost:27017/vetconnect_db?authSource=admin
   ```

   El archivo `.env` está en `.gitignore` y **no se sube a GitHub**.

3. Iniciar la API en modo desarrollo:

   ```bash
   npm run start:dev
   ```

### Esquema de la colección

```ts
@Schema({ timestamps: true })
export class Mascota {
  @Prop({ required: true, trim: true }) nombre: string;
  @Prop({ required: true, trim: true }) especie: string;
  @Prop({ required: true, min: 0 }) edad: number;
  @Prop({ required: true, default: false }) vacunado: boolean;
}
```

### Endpoints

| Método | Ruta         | Descripción                    |
|--------|--------------|--------------------------------|
| GET    | `/mascotas`  | Lista todas las mascotas       |
| POST   | `/mascotas`  | Crea una mascota               |

### Probar la API

```bash
# Listar
curl http://localhost:3000/mascotas

# Crear
curl -X POST http://localhost:3000/mascotas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Nala","especie":"Gato","edad":3}'
```

Respuesta del `POST` (el campo `vacunado` toma el valor por defecto del esquema):

```json
{
  "nombre": "Nala",
  "especie": "Gato",
  "edad": 3,
  "vacunado": false,
  "_id": "6add1f6e2a7e9463b548f136",
  "createdAt": "2026-10-24T21:13:18.730Z",
  "updatedAt": "2026-10-24T21:13:18.730Z",
  "__v": 0
}
```

**Evidencia 4: respuestas de GET y POST**

![GET y POST](evidencias/03-get-post.png)

## Parte D. Comprobar la persistencia

**Reiniciar el contenedor:**

```bash
docker stop mongodb-dev
docker start mongodb-dev
curl http://localhost:3000/mascotas
```

**Eliminar y recrear el contenedor conservando el volumen:**

```bash
docker stop mongodb-dev
docker rm mongodb-dev
docker volume ls          # mongodb_data sigue existiendo
# volver a ejecutar el docker run del paso 3 de la Parte A
curl http://localhost:3000/mascotas
```

En ambos casos los documentos (Rocky y Nala) siguen disponibles, porque los datos viven en el volumen `mongodb_data` y no dentro del contenedor.

> No ejecutar `docker volume rm mongodb_data`: eso sí elimina los datos.

**Evidencia 5: prueba de persistencia**

![Persistencia](evidencias/04-persistencia.png)

## Preguntas de reflexión

**¿Qué problema resuelve un volumen Docker?**
El sistema de archivos de un contenedor es efímero: al eliminarlo se pierde todo lo que guardó. Un volumen almacena los datos fuera del contenedor y los conserva al reiniciarlo o recrearlo.

**¿Qué diferencia hay entre imagen, contenedor y volumen?**
La imagen es la plantilla de solo lectura con el programa ya instalado (`mongo:8.0`). El contenedor es una instancia en ejecución de esa imagen (`mongodb-dev`). El volumen es el espacio de almacenamiento persistente donde se guardan los datos (`mongodb_data`).

**¿Por qué React debe acceder a MongoDB a través de NestJS?**
Porque el navegador es un entorno público: conectar React directamente a la base obligaría a incluir usuario y clave en el código del frontend, que cualquiera puede ver. La API centraliza el acceso, protege las credenciales y permite validar los datos antes de guardarlos.

**¿Qué sucede si se elimina el contenedor sin eliminar el volumen?**
Los datos se conservan. Al crear un nuevo contenedor y montar el mismo volumen, MongoDB encuentra la información anterior. Esto se comprobó en la Parte D.

**¿Por qué no debemos subir `.env` a GitHub?**
Porque contiene credenciales (la clave de la base de datos). Un repositorio público las expone a cualquiera, y aunque se borren después quedan en el historial de Git. Por eso se agrega `.env` al `.gitignore` y se sube solo `.env.example`, sin claves reales.

## Mejoras posteriores

- Agregar DTO con `class-validator` para validar el cuerpo de las peticiones (el `ValidationPipe` ya está activado en `main.ts`).
- Agregar endpoints para editar y eliminar mascotas.
- Alternativa con Docker Compose en lugar de `docker run`.
