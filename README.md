# 💰 SpendTracker – Frontend (Client)

> Aplicación web React para gestión de gastos personales. Interfaz moderna con Material UI, visualizaciones interactivas con Recharts y autenticación JWT.

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF.svg)](https://vitejs.dev/)
[![Material UI](https://img.shields.io/badge/MUI-7.3.4-007FFF.svg)](https://mui.com/)
[![pnpm](https://img.shields.io/badge/pnpm-9.x-F69220.svg)](https://pnpm.io/)

---

## 📋 Tabla de Contenido

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Ejecución](#️-ejecución)
- [Arquitectura](#️-arquitectura)
- [Tecnologías](#-tecnologías)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura de Carpetas](#-estructura-de-carpetas)
- [Flujo de Autenticación](#-flujo-de-autenticación)
- [Integración con Backend](#-integración-con-backend)
- [Componentes Principales](#-componentes-principales)
- [Contribución](#-contribución)

---

## ✨ Características

### Funcionalidades Implementadas

- ✅ **Autenticación JWT**: Login y registro de usuarios con tokens seguros
- ✅ **Dashboard Interactivo**: Resumen visual de gastos con múltiples widgets
- ✅ **Gestión de Gastos**: CRUD completo (crear, listar, editar, eliminar)
- ✅ **Visualizaciones**: Gráficos con Recharts (tendencias, distribución por categoría)
- ✅ **Categorías**: Listado de categorías personalizadas
- ✅ **Responsive Design**: Interfaz adaptable a móviles, tablets y desktop
- ✅ **Tema Personalizado**: Material UI con theme customizado
- ✅ **Notificaciones**: Feedback visual con react-toastify

### En Desarrollo

- 🔄 **CRUD Categorías**: Crear, editar y eliminar categorías (backend listo, falta UI)
- 🔄 **Metas de Ahorro**: Gestión de objetivos de ahorro (pendiente)
- 🔄 **Filtros Avanzados**: Filtrado por rango de fechas y categorías
- 🔄 **Exportación**: Descarga de reportes en PDF/Excel

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: `>=18.0.0` (recomendado: 20.x LTS)
- **pnpm**: `>=9.0.0`
  ```bash
  npm install -g pnpm
  ```
- **Backend**: SpendTracker Server corriendo en `http://127.0.0.1:8000`
  - [Repositorio Backend](https://github.com/nightyvsc/SpendTracker-server)

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/nightyvsc/SpendTracker-client.git
cd SpendTracker-client
```

### 2. Instalar Dependencias

```bash
pnpm install
```

> ⚠️ **Nota**: Este proyecto usa **pnpm** como gestor de paquetes. No uses `npm` o `yarn` para evitar inconsistencias.

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://127.0.0.1:8000
```

**Descripción:**
- `VITE_API_URL`: URL base del backend SpendTracker Server

### Archivo de Ejemplo

Puedes crear un `.env.example` para referencia:

```bash
cp .env.example .env
```

---

## ▶️ Ejecución

### Modo Desarrollo

Inicia el servidor de desarrollo con hot-reload:

```bash
pnpm dev
```

La aplicación estará disponible en: **http://localhost:5173**

### Build de Producción

Compila la aplicación para producción:

```bash
pnpm build
```

Los archivos optimizados se generan en la carpeta `dist/`.

### Preview del Build

Sirve el build de producción localmente:

```bash
pnpm preview
```

---

## 🏗️ Arquitectura

SpendTracker Client sigue una arquitectura modular basada en **feature-folders** y **separation of concerns**:

```
src/
├── components/          # Componentes reutilizables UI
├── context/            # Contextos globales (Auth, Theme)
├── hooks/              # Custom Hooks
├── internals/          # Utilidades internas
├── pages/              # Vistas/Páginas enrutables
├── routes/             # Configuración de React Router
├── services/           # Cliente API (Axios)
├── shared-theme/       # Provider del tema MUI
├── theme/              # Customizaciones de Material UI
└── App.tsx             # Componente raíz
```
<img width="783" height="165" alt="Screenshot 2025-11-13 at 3 56 08 PM" src="https://github.com/user-attachments/assets/a7f29c83-bf34-4265-9c80-505eb75375c4" />


### Principios de Diseño

1. **Component-Based**: Componentes pequeños, reutilizables y testeables
2. **Type Safety**: TypeScript en todo el proyecto
3. **API First**: Comunicación con backend mediante servicios centralizados
4. **Reactive**: Estado local con hooks, global con Context API
5. **Accessible**: Componentes MUI con soporte ARIA

---

## 🛠️ Tecnologías

### Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.2.0 | Biblioteca UI |
| **TypeScript** | 5.9.3 | Type safety |
| **Vite** | 7.1.7 | Build tool y dev server |

### UI y Styling

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Material UI** | 7.3.4 | Componentes UI |
| **@emotion/react** | 11.14.0 | CSS-in-JS |
| **@emotion/styled** | 11.14.0 | Styled components |
| **@mui/x-data-grid-pro** | 8.14.1 | Tablas avanzadas |
| **@mui/x-date-pickers** | 8.14.1 | Selectores de fecha |
| **@mui/x-charts** | 8.14.1 | Gráficos MUI |
| **Recharts** | 3.2.1 | Visualizaciones de datos |

### Routing y Estado

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **react-router-dom** | 7.9.4 | Navegación SPA |
| **Context API** | (React built-in) | Estado global |

### HTTP y Utilidades

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **axios** | 1.12.2 | Cliente HTTP |
| **react-toastify** | 11.0.5 | Notificaciones |
| **dayjs** | 1.12.3 | Manipulación de fechas |
| **js-cookie** | 3.0.7 | Gestión de cookies |
| **clsx** | 2.1.2 | Utilidad para classNames |

### Dev Tools

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **ESLint** | 9.20.0 | Linter JavaScript/TypeScript |
| **@vitejs/plugin-react-swc** | 4.1.2 | Fast Refresh con SWC |

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor de desarrollo (puerto 5173)

# Producción
pnpm build            # Compila TypeScript + build Vite
pnpm preview          # Sirve el build de producción localmente

# Calidad de Código
pnpm lint             # Ejecuta ESLint
```

---

## 📁 Estructura de Carpetas

```
SpendTracker-client/
├── public/                     # Assets estáticos
├── src/
│   ├── assets/                # Imágenes, íconos, etc.
│   │
│   ├── components/            # Componentes reutilizables
│   │   ├── Navbar.tsx        # Barra de navegación
│   │   ├── SideMenu.tsx      # Menú lateral
│   │   ├── TrendWidget.tsx   # Widget de tendencias
│   │   └── ...               # Otros componentes UI
│   │
│   ├── context/              # Contextos globales
│   │   ├── AuthContext.tsx   # Contexto de autenticación
│   │   └── ThemeContext.tsx  # Contexto de tema (si aplica)
│   │
│   ├── hooks/                # Custom Hooks
│   │   ├── useAuth.ts        # Hook de autenticación
│   │   ├── useExpenses.ts    # Hook de gastos
│   │   └── ...               # Otros hooks
│   │
│   ├── internals/            # Utilidades internas
│   │   └── components/
│   │       ├── Copyright.tsx # Footer de copyright
│   │       └── CustomIcons.tsx # Íconos personalizados
│   │
│   ├── pages/                # Páginas enrutables
│   │   ├── Dashboard.tsx     # Página principal con widgets
│   │   ├── CrudDashboard.tsx # Gestión de gastos (tabla)
│   │   ├── SignIn.tsx        # Página de login
│   │   └── SignUp.tsx        # Página de registro
│   │
│   ├── routes/               # Configuración de rutas
│   │   ├── index.tsx         # Definición de rutas
│   │   └── ProtectedRoute.tsx # HOC para rutas protegidas
│   │
│   ├── services/             # API Services
│   │   ├── api.ts            # Cliente Axios configurado
│   │   ├── auth.ts           # Servicios de autenticación
│   │   ├── expenses.ts       # CRUD de gastos
│   │   └── categories.ts     # Servicios de categorías
│   │
│   ├── shared-theme/         # Tema compartido
│   │   ├── AppTheme.tsx      # Provider del tema MUI
│   │   └── themePrimitives.ts # Colores, tipografía, etc.
│   │
│   ├── theme/                # Customizaciones MUI
│   │   ├── customizations.ts # Overrides de componentes
│   │   └── ...               # Otros estilos
│   │
│   ├── App.tsx               # Componente raíz
│   ├── App.css               # Estilos globales
│   ├── main.tsx              # Entry point
│   ├── constants.ts          # Constantes globales
│   └── mixins.ts             # Mixins de estilos
│
├── .env                      # Variables de entorno (no commitear)
├── .env.example              # Ejemplo de variables
├── .gitignore
├── eslint.config.js          # Configuración ESLint
├── index.html                # HTML base
├── package.json              # Dependencias
├── pnpm-lock.yaml            # Lock file de pnpm
├── tsconfig.json             # Configuración TypeScript
├── tsconfig.app.json         # TS config para app
├── tsconfig.node.json        # TS config para Node
└── vite.config.ts            # Configuración Vite
```

---

## 🔐 Flujo de Autenticación

SpendTracker implementa autenticación basada en **JWT (JSON Web Tokens)**:

### 1. Login

```typescript
// services/auth.ts
import api from './api';

export const login = async (username: string, password: string) => {
  const response = await api.post('/api/auth/login/', {
    username,
    password,
  });
  
  const { access, refresh } = response.data;
  
  // Guardar tokens
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  
  return response.data;
};
```

### 2. Interceptor de Axios

El cliente Axios intercepta requests y agrega el token automáticamente:

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor: agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: renovar token si expira
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/refresh/`,
        { refresh: refreshToken }
      );
      
      localStorage.setItem('access_token', data.access);
      originalRequest.headers.Authorization = `Bearer ${data.access}`;
      
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Rutas Protegidas

```typescript
// routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
};
```

---

## 🔗 Integración con Backend

### Configuración Base

Asegúrate de que el backend esté corriendo en `http://127.0.0.1:8000` y que CORS esté habilitado.

### Endpoints Consumidos

| Endpoint | Método | Descripción | Service |
|----------|--------|-------------|---------|
| `/api/auth/login/` | POST | Inicio de sesión | `auth.ts` |
| `/api/auth/signup/` | POST | Registro de usuario | `auth.ts` |
| `/api/auth/refresh/` | POST | Renovar access token | `api.ts` (interceptor) |
| `/api/expenses/` | GET | Listar gastos | `expenses.ts` |
| `/api/expenses/` | POST | Crear gasto | `expenses.ts` |
| `/api/expenses/:id/` | GET | Detalle de gasto | `expenses.ts` |
| `/api/expenses/:id/` | PUT | Actualizar gasto | `expenses.ts` |
| `/api/expenses/:id/` | DELETE | Eliminar gasto | `expenses.ts` |
| `/api/categories/` | GET | Listar categorías | `categories.ts` |
| `/api/reports/summary/` | GET | Resumen de gastos | `reports.ts` |
| `/api/reports/by-category/` | GET | Gastos por categoría | `reports.ts` |
| `/api/reports/trend/` | GET | Tendencias temporales | `reports.ts` |

### Ejemplo de Uso

```typescript
// services/expenses.ts
import api from './api';

export const listExpenses = async () => {
  const response = await api.get('/api/expenses/');
  return response.data;
};

export const createExpense = async (data: ExpenseCreate) => {
  const response = await api.post('/api/expenses/', data);
  return response.data;
};

export const updateExpense = async (id: number, data: ExpenseUpdate) => {
  const response = await api.put(`/api/expenses/${id}/`, data);
  return response.data;
};

export const deleteExpense = async (id: number) => {
  await api.delete(`/api/expenses/${id}/`);
};
```

---

## 🎨 Componentes Principales

### Dashboard

**Ubicación:** `src/pages/Dashboard.tsx`

Página principal que muestra resumen de gastos con widgets interactivos:
- Resumen mensual
- Gráfico de tendencias (Recharts)
- Distribución por categoría
- Últimos gastos

### CrudDashboard

**Ubicación:** `src/pages/CrudDashboard.tsx`

Gestión completa de gastos con tabla MUI DataGrid:
- Lista paginada de gastos
- Crear nuevo gasto (modal/drawer)
- Editar gasto existente
- Eliminar gasto con confirmación
- Filtros y búsqueda

### SignIn / SignUp

**Ubicación:** `src/pages/SignIn.tsx`, `src/pages/SignUp.tsx`

Formularios de autenticación con validación:
- Inputs controlados con MUI TextField
- Validación en tiempo real
- Feedback de errores
- Redirección automática tras login exitoso

### Navbar y SideMenu

**Ubicación:** `src/components/Navbar.tsx`, `src/components/SideMenu.tsx`

Navegación principal:
- Responsive (burger menu en móvil)
- Indicador de usuario logueado
- Logout
- Links a secciones principales

---

## 🎨 Personalización del Tema

SpendTracker usa un tema personalizado de Material UI:

```typescript
// shared-theme/themePrimitives.ts
export const brand = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  // ... más colores
};

export const gray = {
  50: '#F3F6F9',
  // ... más colores
};
```

### Modo Oscuro / Claro

El tema se puede cambiar dinámicamente (si está implementado en `AppTheme.tsx`):

```typescript
<AppTheme mode="dark"> {/* o "light" */}
  <App />
</AppTheme>
```

---

## 🧪 Testing

### Pruebas Manuales

1. **Autenticación:**
   - Registrar nuevo usuario
   - Login con credenciales válidas
   - Intentar login con credenciales inválidas
   - Verificar redirección a /signin si no hay token

2. **Dashboard:**
   - Visualizar resumen de gastos
   - Interactuar con gráficos
   - Verificar carga de datos desde API

3. **CRUD Gastos:**
   - Crear gasto nuevo
   - Editar gasto existente
   - Eliminar gasto
   - Verificar validaciones de formulario

### Tests Automatizados (Próximamente)

```bash
# Ejecutar tests (cuando estén implementados)
pnpm test
```

---

## 📱 Responsive Design

La aplicación es completamente responsive gracias a Material UI:

- **Mobile** (< 600px): Layout de columna única, menú hamburguesa
- **Tablet** (600-960px): Layout adaptado, side menu colapsable
- **Desktop** (> 960px): Layout completo con side menu permanente

---

## 🚨 Troubleshooting

### Error: "Cannot connect to backend"

**Solución:**
1. Verifica que el backend esté corriendo: `http://127.0.0.1:8000`
2. Revisa la variable `VITE_API_URL` en `.env`
3. Confirma que CORS esté habilitado en el backend

### Error: "401 Unauthorized"

**Solución:**
1. Verifica que el token JWT esté en localStorage
2. Intenta hacer logout y login nuevamente
3. Revisa que el token no haya expirado

### Error: "Module not found"

**Solución:**
```bash
# Borra node_modules y reinstala
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Falla

**Solución:**
```bash
# Limpia cache de Vite
rm -rf dist .vite
pnpm build
```

---

## 🤝 Contribución

### Flujo de Trabajo con Git

```bash
# 1. Crea una rama feature
git checkout -b feature/nombre-funcionalidad

# 2. Haz commits descriptivos
git add .
git commit -m "feat(expenses): add filter by date range"

# 3. Push a tu rama
git push origin feature/nombre-funcionalidad

# 4. Crea un Pull Request a develop
```

### Convención de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): descripción corta
fix(scope): descripción corta
docs(scope): descripción corta
style(scope): descripción corta
refactor(scope): descripción corta
test(scope): descripción corta
```

**Ejemplos:**
```
feat(auth): add password recovery
fix(dashboard): correct trend chart data
docs(readme): update installation steps
```

---

## 👥 Equipo

- **Juan Manuel** - Auth Module & Setup
- **Pérez** - Finances CRUD
- **Santiago** - Reports (Summary, Category)
- **Basto** - Reports (Trend)

---

## 📄 Licencia

Este proyecto es parte de un trabajo académico de Desarrollo de Software.

---

## 🔗 Enlaces

- **Backend Repository:** [SpendTracker-server](https://github.com/nightyvsc/SpendTracker-server)
- **Frontend Repository:** [SpendTracker-client](https://github.com/nightyvsc/SpendTracker-client)
- **Documentación Backend:** [README Backend](https://github.com/nightyvsc/SpendTracker-server#readme)

---

⭐ **¡Si te gustó el proyecto, deja una estrella en GitHub!**
