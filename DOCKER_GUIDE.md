# 🐳 Guía de Dockerización - SpendTracker Client

Esta guía te explica paso a paso cómo funciona la dockerización de esta aplicación React con Vite.

## 📚 Conceptos Básicos de Docker

### ¿Qué es Docker?
Docker es una plataforma que permite empaquetar aplicaciones y sus dependencias en "contenedores" que pueden ejecutarse en cualquier sistema que tenga Docker instalado.

### Ventajas de Dockerizar una aplicación:
- ✅ **Portabilidad**: Funciona igual en cualquier sistema (Windows, Linux, Mac)
- ✅ **Aislamiento**: La aplicación y sus dependencias están aisladas
- ✅ **Consistencia**: Mismo entorno en desarrollo, testing y producción
- ✅ **Facilidad de despliegue**: Un solo comando para construir y ejecutar

---

## 🏗️ Arquitectura del Dockerfile

Nuestro Dockerfile usa una técnica llamada **Multi-Stage Build** que consta de dos etapas:

### **ETAPA 1: Builder (Construcción)**
```dockerfile
FROM node:20-alpine AS builder
```
- **Propósito**: Construir la aplicación React
- **Imagen base**: `node:20-alpine` (Node.js 20 en Alpine Linux, muy ligero)
- **Proceso**:
  1. Copia los archivos de dependencias (`package.json`, `package-lock.json`)
  2. Instala las dependencias con `npm ci`
  3. Copia el código fuente
  4. Ejecuta `npm run build` para generar archivos estáticos en `dist/`

### **ETAPA 2: Production (Producción)**
```dockerfile
FROM nginx:alpine
```
- **Propósito**: Servir los archivos estáticos
- **Imagen base**: `nginx:alpine` (servidor web ligero)
- **Proceso**:
  1. Copia los archivos de `dist/` desde la etapa builder
  2. Configura nginx para servir la aplicación
  3. Expone el puerto 80

### ¿Por qué Multi-Stage?
- **Imagen final más pequeña**: Solo incluye nginx, no Node.js ni las dependencias de desarrollo
- **Seguridad**: Menos superficie de ataque (sin herramientas de desarrollo)
- **Rendimiento**: Imagen más ligera = descarga y despliegue más rápido

---

## 📝 Explicación del Dockerfile (Línea por Línea)

### Etapa 1: Builder

```dockerfile
FROM node:20-alpine AS builder
```
- `FROM`: Especifica la imagen base
- `node:20-alpine`: Node.js versión 20 en Alpine Linux (muy ligero)
- `AS builder`: Le da un nombre a esta etapa para referenciarla después

```dockerfile
WORKDIR /app
```
- Establece el directorio de trabajo dentro del contenedor
- Todos los comandos siguientes se ejecutarán en `/app`

```dockerfile
COPY package*.json ./
COPY pnpm-lock.yaml ./
```
- Copia los archivos de dependencias PRIMERO
- **¿Por qué primero?** Docker cachea las capas. Si `package.json` no cambia, reutiliza la capa de `npm ci`, ahorrando tiempo

```dockerfile
RUN npm ci
```
- `npm ci`: "Clean Install" - instala dependencias de forma limpia y rápida
- Más rápido y confiable que `npm install` para producción

```dockerfile
COPY . .
```
- Copia todo el código fuente al contenedor
- El `.dockerignore` excluye archivos innecesarios

```dockerfile
RUN npm run build
```
- Ejecuta el script de build definido en `package.json`
- Genera archivos optimizados en `dist/`

### Etapa 2: Production

```dockerfile
FROM nginx:alpine
```
- Nueva imagen base, solo nginx (muy ligero)

```dockerfile
COPY --from=builder /app/dist /usr/share/nginx/html
```
- `--from=builder`: Copia desde la etapa anterior
- `/app/dist`: Archivos construidos
- `/usr/share/nginx/html`: Directorio donde nginx sirve archivos estáticos

```dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf
```
- Copia nuestra configuración personalizada de nginx

```dockerfile
EXPOSE 80
```
- Documenta que el contenedor usa el puerto 80
- No abre el puerto automáticamente (eso lo hace `docker run -p`)

```dockerfile
CMD ["nginx", "-g", "daemon off;"]
```
- Comando que se ejecuta al iniciar el contenedor
- `daemon off;`: Ejecuta nginx en primer plano (necesario para Docker)

---

## 📄 Archivos de Configuración

### `.dockerignore`
Similar a `.gitignore`, pero para Docker. Excluye archivos que no necesitas en el contenedor:
- `node_modules`: Se instalan dentro del contenedor
- `dist`: Se genera durante el build
- Archivos de desarrollo, IDE, Git, etc.

**Beneficio**: Builds más rápidos e imágenes más pequeñas

### `nginx.conf`
Configuración del servidor web nginx:
- **SPA Routing**: `try_files $uri $uri/ /index.html;` - Todas las rutas sirven `index.html` para que React Router funcione
- **Compresión gzip**: Reduce el tamaño de los archivos transferidos
- **Caché**: Archivos estáticos se cachean por 1 año
- **Seguridad**: Headers de seguridad HTTP

---

## 🚀 Comandos de Docker

### 1. Construir la imagen
```bash
docker build -t spendtracker-client .
```
- `-t`: Etiqueta/nombre de la imagen
- `.`: Contexto (directorio actual)

### 2. Ejecutar el contenedor
```bash
docker run -p 3000:80 spendtracker-client
```
- `-p 3000:80`: Mapea puerto 3000 del host al puerto 80 del contenedor
- Accede en: http://localhost:3000

### 3. Ejecutar en segundo plano
```bash
docker run -d -p 3000:80 --name my-app spendtracker-client
```
- `-d`: Detached mode (segundo plano)
- `--name`: Nombre del contenedor

### 4. Ver contenedores en ejecución
```bash
docker ps
```

### 5. Detener el contenedor
```bash
docker stop my-app
```

### 6. Ver logs
```bash
docker logs my-app
```

### 7. Eliminar contenedor
```bash
docker rm my-app
```

### 8. Eliminar imagen
```bash
docker rmi spendtracker-client
```

---

## 🎯 Usando Docker Compose

Docker Compose simplifica el manejo de contenedores con un archivo YAML.

### Comandos principales:

```bash
# Construir y ejecutar
docker-compose up

# Construir y ejecutar en segundo plano
docker-compose up -d

# Construir sin caché (útil si hay problemas)
docker-compose build --no-cache

# Detener
docker-compose down

# Ver logs
docker-compose logs -f

# Reconstruir después de cambios
docker-compose up --build
```

---

## 🔍 Flujo Completo de Dockerización

```
1. DESARROLLO
   └─> Escribes código en tu máquina local

2. DOCKERFILE
   └─> Define cómo construir la imagen

3. BUILD
   └─> docker build crea la imagen:
       ├─> Instala dependencias
       ├─> Construye la aplicación
       └─> Prepara servidor nginx

4. IMAGEN
   └─> Archivo comprimido con todo lo necesario

5. CONTENEDOR
   └─> docker run crea una instancia ejecutable

6. PRODUCCIÓN
   └─> La misma imagen funciona en cualquier servidor
```

---

## 💡 Mejores Prácticas

1. **Usa Multi-Stage Builds**: Imágenes más pequeñas
2. **Ordena las capas**: Copia archivos que cambian menos primero (para cache)
3. **Usa .dockerignore**: Excluye archivos innecesarios
4. **Versiones específicas**: `node:20-alpine` en vez de `node:alpine`
5. **No ejecutes como root**: Considera crear un usuario no-root (avanzado)
6. **Minimiza capas**: Combina comandos RUN cuando sea posible

---

## 🐛 Troubleshooting

### Error: "Cannot find module"
- Verifica que `package.json` esté copiado antes de `npm ci`
- Revisa que todas las dependencias estén en `package.json`

### Error: "Port already in use"
- Cambia el puerto: `docker run -p 3001:80 ...`
- O detén el proceso que usa el puerto

### La app no carga
- Verifica los logs: `docker logs <container-name>`
- Revisa que nginx.conf esté correcto
- Asegúrate de que el build generó archivos en `dist/`

### Build muy lento
- Verifica que `.dockerignore` esté funcionando
- Usa Docker BuildKit: `DOCKER_BUILDKIT=1 docker build ...`

---

## 📚 Recursos Adicionales

- [Documentación oficial de Docker](https://docs.docker.com/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- [nginx documentation](https://nginx.org/en/docs/)

---

## ✅ Checklist de Dockerización

- [x] Dockerfile creado con multi-stage build
- [x] .dockerignore configurado
- [x] nginx.conf para SPA routing
- [x] docker-compose.yml para facilitar el uso
- [x] Documentación completa

¡Tu aplicación está lista para dockerizar! 🎉

