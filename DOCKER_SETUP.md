# 🐳 Guía de Docker Compose - SpendTracker

Esta guía explica cómo levantar toda la aplicación (Frontend + Backend + Base de Datos) usando Docker Compose.

## 📋 Requisitos Previos

- Docker instalado
- Docker Compose instalado (viene con Docker Desktop)

## 🚀 Inicio Rápido

### 1. Levantar todos los servicios

Desde el directorio `SpendTracker-client/`:

```bash
docker-compose up --build
```

Este comando:
- Construye las imágenes del frontend y backend
- Descarga la imagen de MySQL
- Inicia los 3 servicios en el orden correcto:
  1. **MySQL** (puerto 3306)
  2. **Backend Django** (puerto 8000) - espera a que MySQL esté listo
  3. **Frontend React** (puerto 3000) - espera a que el backend esté listo

### 2. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **MySQL**: localhost:3306

### 3. Detener los servicios

```bash
# Detener (mantiene los contenedores)
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener y eliminar contenedores + volúmenes (¡borra la BD!)
docker-compose down -v
```

## 📝 Comandos Útiles

### Ver logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo un servicio
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f db
```

### Reconstruir un servicio específico

```bash
# Reconstruir solo el frontend
docker-compose up --build frontend

# Reconstruir solo el backend
docker-compose up --build backend
```

### Ejecutar en segundo plano

```bash
docker-compose up -d
```

### Ver estado de los contenedores

```bash
docker-compose ps
```

## 🔧 Configuración

### Cambiar la URL del Backend

Si necesitas cambiar la URL del backend que usa el frontend, edita `docker-compose.yml`:

```yaml
frontend:
  build:
    args:
      - VITE_API_URL=http://tu-url-aqui:8000
```

Luego reconstruye:

```bash
docker-compose up --build frontend
```

### Variables de Entorno del Backend

Las variables del backend están en `docker-compose.yml`:

```yaml
backend:
  environment:
    - DB_HOST=db
    - DB_NAME=spend_tracker
    - DB_USER=st_user
    - DB_PASSWORD=1234
    - DB_PORT=3306
    - DEBUG=True
```

## 🏗️ Arquitectura

```
┌─────────────────┐
│   Frontend      │  (React + Vite + nginx)
│   Puerto 3000   │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   Backend       │  (Django REST Framework)
│   Puerto 8000   │
└────────┬────────┘
         │ SQL
         ▼
┌─────────────────┐
│   MySQL         │  (Base de datos)
│   Puerto 3306   │
└─────────────────┘
```

## 🔍 Troubleshooting

### Error: "Cannot connect to backend"

1. Verifica que el backend esté corriendo:
   ```bash
   docker-compose ps
   ```

2. Revisa los logs del backend:
   ```bash
   docker-compose logs backend
   ```

3. Verifica que el backend esté accesible:
   ```bash
   curl http://localhost:8000
   ```

### Error: "MySQL connection failed"

1. Verifica que MySQL esté saludable:
   ```bash
   docker-compose ps db
   ```

2. Espera unos segundos, MySQL tarda en iniciar

3. Revisa los logs:
   ```bash
   docker-compose logs db
   ```

### Error: "Port already in use"

Si algún puerto está ocupado, cambia el mapeo en `docker-compose.yml`:

```yaml
ports:
  - "3001:80"  # Cambia 3000 por 3001
```

### El frontend no se conecta al backend

1. Verifica que `VITE_API_URL` esté configurado correctamente en el build
2. Reconstruye el frontend:
   ```bash
   docker-compose up --build frontend
   ```

### Limpiar todo y empezar de nuevo

```bash
# Detener y eliminar todo
docker-compose down -v

# Eliminar imágenes
docker rmi spendtracker-client:latest
docker rmi spendtracker-server:latest  # o el nombre que tenga

# Volver a construir
docker-compose up --build
```

## 📚 Estructura de Archivos

```
SpendTracker-client/
├── Dockerfile              # Build del frontend
├── docker-compose.yml      # Orquestación de todos los servicios
├── nginx.conf             # Configuración de nginx
└── ../SpendTracker-server/
    ├── Dockerfile          # Build del backend
    └── entrypoint.sh       # Script de inicio del backend
```

## ✅ Checklist de Verificación

- [ ] Docker y Docker Compose instalados
- [ ] Puerto 3000 disponible (frontend)
- [ ] Puerto 8000 disponible (backend)
- [ ] Puerto 3306 disponible (MySQL)
- [ ] Backend tiene acceso al directorio `../SpendTracker-server`

## 🎯 Flujo de Inicio

1. **MySQL** inicia y espera conexiones
2. **Backend** espera a que MySQL esté saludable
3. Backend ejecuta migraciones automáticamente
4. Backend inicia el servidor Django
5. **Frontend** espera a que el backend esté listo
6. Frontend sirve la aplicación en nginx

¡Todo listo! 🎉

