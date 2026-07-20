# HSSC Courier - Sistema de Gestion Logistica

Sistema completo de trazabilidad y gestion de paquetes para HSSC Courier.

## Stack Tecnologico

| Capa | Tecnologia | Puerto |
|---|---|---|
| Base de Datos | MySQL 8.0 | 3306 |
| Backend | Java 21 + Spring Boot 3.3 | 8080 |
| Frontend | React 18 + Vite 5 | 5173 |

## Estructura del Proyecto

```
hsscEScner/
├── database/
│   ├── 01_schema.sql       # Creacion de tablas
│   ├── 02_seed.sql         # Datos de prueba
│   └── setup_db.bat        # Script de configuracion de BD
├── backend/                # Spring Boot (Java)
│   ├── pom.xml
│   └── src/main/java/com/hssc/courier/
│       ├── config/         # SecurityConfig (JWT + CORS)
│       ├── controller/     # 6 controladores REST
│       ├── dto/            # Data Transfer Objects
│       ├── model/          # 7 entidades JPA
│       ├── repository/     # 7 interfaces Spring Data
│       ├── security/       # JwtUtil, JwtFilter, UserDetailsService
│       └── service/        # 6 servicios de negocio
├── frontend/               # React + Vite
│   └── src/
│       ├── pages/          # Login, Dashboard, Paquetes, Clientes,
│       │                   # HojasRuta, Trazabilidad, Escaneo
│       ├── components/     # Sidebar, Modal, EstadoBadge, ProtectedRoute
│       ├── context/        # AuthContext (JWT)
│       └── services/       # api.js (Axios)
├── start-backend.bat       # Inicia el backend
└── start-frontend.bat      # Inicia el frontend
```

## Configuracion Inicial (una sola vez)

### 1. Configurar la Base de Datos

```bat
cd database
setup_db.bat
```

Esto crea la BD, todas las tablas y los datos de prueba.

### 2. Ajustar credenciales de MySQL (si es necesario)

Editar `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=root
```

## Ejecutar el Sistema

Abrir dos terminales y ejecutar en orden:

**Terminal 1 - Backend:**
```bat
start-backend.bat
```

Esperar hasta ver: `Started HsscCourierApplication in X seconds`

**Terminal 2 - Frontend:**
```bat
start-frontend.bat
```

Luego abrir el navegador en: **http://localhost:5173**

## Cuentas de Prueba

| Correo | Password | Rol |
|---|---|---|
| admin@hssc.com | Admin1234 | Administrador |
| recepcion@hssc.com | Admin1234 | Recepcionista |
| coordinador@hssc.com | Admin1234 | Coordinador |
| repartidor1@hssc.com | Admin1234 | Repartidor |
| repartidor2@hssc.com | Admin1234 | Repartidor |

## Modulos del Sistema

### Dashboard
Resumen estadistico con contadores por estado y grafico de barras.

### Paquetes
- Listado con filtros por estado y busqueda por texto
- Registro de nuevas encomiendas con generacion automatica del codigo tracking (formato: HSSC-YYYY-NNNN)

### Clientes
- CRUD completo de remitentes y destinatarios
- Tipos de documento: DNI, RUC, Carnet de Extranjeria

### Hojas de Ruta
- Creacion de asignaciones diarias para repartidores
- Seleccion de paquetes disponibles (en almacen)
- Control de estados: PENDIENTE -> EN_CURSO -> COMPLETADA

### Trazabilidad
- Busqueda por codigo tracking
- Timeline cronologico de todos los escaneos
- Muestra coordenadas GPS, operador y ubicacion textual

### Escaneo Movil
- Vista de camara web con visor de codigo de barras
- Ingreso manual del codigo
- Captura de coordenadas GPS automatica
- Actualizacion de estado y registro en trazabilidad

## API REST - Endpoints Principales

```
POST /api/auth/login               Autenticacion
GET  /api/paquetes                 Listar paquetes
POST /api/paquetes                 Registrar paquete
GET  /api/paquetes/tracking/{cod}  Buscar por tracking (publico)
POST /api/paquetes/escanear        Procesar escaneo
GET  /api/clientes                 Listar clientes
POST /api/clientes                 Crear cliente
GET  /api/hojas-ruta               Listar hojas de ruta
POST /api/hojas-ruta               Crear hoja de ruta
GET  /api/trazabilidad/tracking/{cod} Historial de paquete
```

## Patrones de Diseno Aplicados

- **Capas**: Presentacion (React) / Negocio (Services) / Datos (Repositories)
- **MVC**: Controllers / Services / Models en el backend
- **DAO**: Spring Data JPA como abstraccion de acceso a datos
- **JWT**: Autenticacion stateless con tokens Bearer
