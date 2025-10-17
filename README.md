# 🏥 Sistema de Turnero de Castración - BIOCORDOBA

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Descripción del Proyecto

Sistema web de gestión de turnos para castraciones desarrollado como **Proyecto Final** de la carrera **Analista Universitario en Sistemas** de la **Universidad Tecnológica Nacional - Facultad Regional Córdoba (UTN FRC)**.

Este proyecto fue desarrollado en colaboración con **BIOCORDOBA** (Ente BiCórdoba), con el objetivo de modernizar y optimizar el proceso de asignación de turnos para castraciones de animales domésticos en los distintos centros de castración de la ciudad de Córdoba.

## 🎯 Objetivos del Sistema

- ✅ Facilitar la solicitud de turnos de castración para vecinos
- ✅ Optimizar la gestión de agendas en múltiples centros de castración
- ✅ Proveer herramientas de administración para el personal de BIOCORDOBA
- ✅ Generar reportes y estadísticas sobre castraciones realizadas
- ✅ Mejorar la experiencia del usuario mediante una interfaz moderna y responsiva

## 🏗️ Arquitectura del Proyecto

Este es un **monorepo** organizado en dos módulos principales:

```
Turnero-Publico/
├── 📁 backend/          # API REST - .NET 8.0
│   └── Desarrollo del Producto/Backend/SolutionTurneroCastracion/
│       ├── SistemaTurneroCastracion.API/       # Capa de presentación (Controllers)
│       ├── SistemaTurneroCastracion.BLL/       # Capa de lógica de negocio
│       ├── SistemaTurneroCastracion.DAL/       # Capa de acceso a datos
│       ├── SistemaTurneroCastracion.Entity/    # Entidades y DTOs
│       └── SistemaTurneroCastracion.IOC/       # Inyección de dependencias
│
└── 📁 frontend/         # Interfaz de Usuario - React + Vite
    └── Frontend/vite-project/
        ├── src/
        │   ├── components/    # Componentes React organizados por rol
        │   ├── services/      # Servicios para consumir la API
        │   └── assets/        # Recursos estáticos
        └── package.json
```

## 🛠️ Tecnologías Utilizadas

### Backend

- **Framework:** .NET 8.0 (ASP.NET Core Web API)
- **Arquitectura:** N-Capas (API, BLL, DAL, Entity, IOC)
- **ORM:** Entity Framework Core
- **Autenticación:** JWT (JSON Web Tokens)
- **Documentación API:** Swagger/OpenAPI
- **Mensajería:** RabbitMQ (para envío asíncrono de correos)
- **Base de Datos:** SQL Server

### Frontend

- **Framework:** React 18.3.1
- **Build Tool:** Vite
- **UI Components:** Material-UI (MUI), React Bootstrap
- **Gestión de Estado:** React Hooks
- **HTTP Client:** Axios
- **Enrutamiento:** React Router
- **Calendario:** React Big Calendar, React Datepicker
- **Estilos:** CSS Modules, Bootstrap 5

## 📦 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

### Para el Backend

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) o superior
- [SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads) (Express o Developer)
- [RabbitMQ](https://www.rabbitmq.com/download.html) (opcional, para envío de correos)

### Para el Frontend

- [Node.js](https://nodejs.org/) (versión 18.x o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

### Herramientas Recomendadas

- [Visual Studio 2022](https://visualstudio.microsoft.com/) o [Visual Studio Code](https://code.visualstudio.com/)
- [SQL Server Management Studio (SSMS)](https://aka.ms/ssmsfullsetup)
- [Postman](https://www.postman.com/) o [Thunder Client](https://www.thunderclient.com/) para pruebas de API

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/juanicamargo2001/Turnero-Publico.git
cd Turnero-Publico
```

### 2️⃣ Configuración del Backend

#### Paso 1: Navegar al proyecto del backend

```bash
cd backend/Desarrollo\ del\ Producto/Backend/SolutionTurneroCastracion
```

#### Paso 2: Restaurar las dependencias

```bash
dotnet restore
```

#### Paso 3: Configurar la cadena de conexión

Edita el archivo `SistemaTurneroCastracion.API/appsettings.Development.json` y configura tu cadena de conexión a SQL Server:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TurneroCastracion;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "tu-clave-secreta-muy-segura-aqui",
    "Issuer": "TurneroCastracion",
    "Audience": "TurneroCastracion"
  }
}
```

#### Paso 4: Crear la base de datos

```bash
# Ejecutar las migraciones (si existen)
dotnet ef database update --project SistemaTurneroCastracion.DAL

# O crear la base de datos manualmente usando los scripts SQL proporcionados
```

#### Paso 5: Ejecutar el backend

```bash
cd SistemaTurneroCastracion.API
dotnet run
```

El backend estará disponible en:

- **HTTP:** `http://localhost:5000`
- **HTTPS:** `https://localhost:5001`
- **Swagger UI:** `https://localhost:5001/swagger`

---

### 3️⃣ Configuración del Frontend

#### Paso 1: Navegar al proyecto del frontend

```bash
# Desde la raíz del proyecto
cd frontend/Frontend/vite-project
```

#### Paso 2: Instalar las dependencias

```bash
npm install
```

#### Paso 3: Configurar las variables de entorno

Crea un archivo `.env` en la raíz del proyecto de Vite:

```bash
# frontend/Frontend/vite-project/.env
VITE_API_URL=https://localhost:5001/api
```

O edita el archivo `src/config.js` si existe para configurar la URL base de la API.

#### Paso 4: Ejecutar el frontend en modo desarrollo

```bash
npm run dev
```

El frontend estará disponible en:

- **URL:** `http://localhost:5173`

#### Paso 5: Compilar para producción (opcional)

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`.

---

## 🎮 Uso del Sistema

### Acceso al Sistema

1. **Vecinos:** Pueden registrarse y solicitar turnos para castración de sus mascotas
2. **Secretarias:** Gestionan turnos telefónicos y urgencias
3. **Veterinarios:** Administran las agendas de los centros asignados
4. **Administradores:** Control total del sistema, reportes y configuración
5. **Super Administradores:** Gestión de personal y configuraciones avanzadas

### Flujo de Trabajo Principal

1. **Registro de Vecino:** El usuario se registra con sus datos personales
2. **Registro de Mascota:** Asocia sus mascotas al sistema
3. **Solicitud de Turno:** Selecciona centro, fecha y horario disponible
4. **Confirmación:** Recibe confirmación por email
5. **Recordatorio:** El sistema envía recordatorios automáticos
6. **Asistencia:** El vecino asiste al centro en la fecha programada
7. **Calificación:** Opcionalmente puede calificar el servicio recibido

---

## 📂 Estructura de Carpetas Detallada

### Backend

```
backend/Desarrollo del Producto/Backend/SolutionTurneroCastracion/
│
├── SistemaTurneroCastracion.API/
│   ├── Controllers/          # Controladores de la API REST
│   ├── Program.cs            # Punto de entrada de la aplicación
│   └── appsettings.json      # Configuración de la aplicación
│
├── SistemaTurneroCastracion.BLL/
│   ├── Seguridad/            # Lógica de autenticación y autorización
│   └── Interfaces/           # Contratos de servicios
│
├── SistemaTurneroCastracion.DAL/
│   ├── DBContext/            # Contexto de Entity Framework
│   ├── Implementacion/       # Repositorios implementados
│   ├── Interfaces/           # Contratos de repositorios
│   └── Publisher/            # Publicadores de mensajes (RabbitMQ)
│
├── SistemaTurneroCastracion.Entity/
│   ├── Dtos/                 # Data Transfer Objects
│   └── *.cs                  # Entidades del dominio
│
└── SistemaTurneroCastracion.IOC/
    └── Dependecia.cs         # Configuración de inyección de dependencias
```

### Frontend

```
frontend/Frontend/vite-project/
│
├── src/
│   ├── components/
│   │   ├── Admin/            # Componentes para administradores
│   │   ├── Centro/           # Gestión de centros de castración
│   │   ├── Login/            # Autenticación de usuarios
│   │   ├── Medicamentos/     # Gestión de medicamentos
│   │   ├── Perfil/           # Gestión de perfil de usuario
│   │   ├── Secretaria/       # Componentes para secretarias
│   │   ├── SuperAdmin/       # Componentes para super administradores
│   │   ├── Turnero/          # Sistema de turnos
│   │   ├── Vecino/           # Componentes para vecinos
│   │   └── Veterinario/      # Componentes para veterinarios
│   │
│   ├── services/             # Servicios de API (Axios)
│   ├── assets/               # Imágenes y recursos estáticos
│   ├── App.jsx               # Componente principal
│   └── main.jsx              # Punto de entrada
│
├── public/                   # Archivos públicos
├── index.html                # HTML principal
├── package.json              # Dependencias del proyecto
└── vite.config.js            # Configuración de Vite
```

---

## 🔐 Seguridad

- **Autenticación:** JWT (JSON Web Tokens) con refresh tokens
- **Autorización:** Basada en roles (Vecino, Secretaria, Veterinario, Admin, SuperAdmin)
- **Encriptación:** Contraseñas hasheadas con algoritmos seguros
- **Validación:** Validación de datos en frontend y backend
- **CORS:** Configuración de políticas de origen cruzado

---

## 📊 Características Principales

### Gestión de Turnos

- ✅ Solicitud de turnos en línea
- ✅ Turnos telefónicos (para vecinos sin acceso a internet)
- ✅ Turnos de urgencia
- ✅ Cancelación y reprogramación
- ✅ Sistema de confirmación por email

### Gestión de Agendas

- ✅ Configuración de horarios por centro
- ✅ Habilitación/deshabilitación de días específicos
- ✅ Cupos limitados por franja horaria
- ✅ Feriados y días no laborables

### Reportes y Estadísticas

- ✅ Reporte de castraciones por periodo
- ✅ Estadísticas por tipo de animal
- ✅ Reportes de cancelaciones
- ✅ Calificaciones de servicio

### Notificaciones

- ✅ Confirmación de turno por email
- ✅ Recordatorios automáticos
- ✅ Instrucciones postoperatorias
- ✅ Notificaciones de cancelación

---

## 🤝 Equipo de Desarrollo

Este proyecto fue desarrollado por estudiantes de la carrera **Analista Universitario en Sistemas** de la **UTN FRC**.

**Desarrolladores:**

- Juan Ignacio Camargo ([GitHub](https://github.com/juanicamargo2001))

**Asesoramiento Técnico:**

- BIOCORDOBA (Ente BiCórdoba)

**Institución:**

- Universidad Tecnológica Nacional - Facultad Regional Córdoba

---

## 📝 Licencia

Este proyecto fue desarrollado con fines académicos para la Universidad Tecnológica Nacional y BIOCORDOBA.

---

## 📧 Contacto

Para consultas sobre el proyecto:

- **GitHub Issues:** [Reportar un problema](https://github.com/juanicamargo2001/Turnero-Publico/issues)

---

## 🙏 Agradecimientos

Agradecemos especialmente a:

- **BIOCORDOBA** por brindarnos la oportunidad de desarrollar este proyecto real
- **UTN FRC** por la formación académica recibida
- **Docentes y tutores** que guiaron el desarrollo del proyecto

---

<div align="center">
  <p>Desarrollado con ❤️ por estudiantes de la UTN FRC</p>
  <p>En colaboración con BIOCORDOBA</p>
  <img src="frontend/Frontend/vite-project/src/imgs/logoBiocCordoba.png" alt="BIOCORDOBA Logo" width="200"/>
</div>
