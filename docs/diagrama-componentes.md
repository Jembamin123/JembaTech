# Diagrama de componentes - EP1

El siguiente nivel muestra los componentes principales dentro de cada contenedor. Corresponde a la estructura implementada en el repositorio.

```mermaid
flowchart TB
  subgraph A[Frontend · Ionic + Angular]
    ROUTES[Angular Router\nrutas y carga diferida]
    GUARDS[authGuard / adminGuard]
    LAYOUT[LayoutPrincipal\nencabezado, menú, tema, WhatsApp]
    PAGES[Páginas\nlogin, perfil, cotizaciones, consultas, admin]
    CLIENTS[Servicios HTTP\nautenticación, cotizaciones, evaluación]
    ROUTES --> GUARDS --> LAYOUT --> PAGES
    PAGES --> CLIENTS
  end

  subgraph N[NestJS · API principal]
    AUTHC[AuthController]
    QUOTESC[QuotesController]
    EVALC[EvaluationsController]
    HEALTHC[HealthController]
    AUTHS[AuthService\nJWT y bcrypt]
    ROLES[JwtAuthGuard + RolesGuard]
    EVALS[EvaluatorService\ntimeout y llamada HTTP]
    PRISMA[PrismaService]
    AUTHC --> AUTHS
    QUOTESC --> ROLES
    QUOTESC --> PRISMA
    EVALC --> ROLES
    EVALC --> EVALS
    EVALC --> PRISMA
  end

  subgraph F[FastAPI · evaluador]
    API[/health y /evaluate]
    RULES[Reglas de compatibilidad\ny puntaje explicable]
    API --> RULES
  end

  DB[(PostgreSQL)]
  CLIENTS -->|REST + JWT| AUTHC
  CLIENTS -->|REST + JWT| QUOTESC
  CLIENTS -->|REST + JWT| EVALC
  EVALS -->|REST interno| API
  PRISMA --> DB
```

## Componentes del frontend

| Grupo | Componentes reales | Función |
| --- | --- | --- |
| Navegación | `app.routes.ts`, `autenticacion.guard.ts` | Protege perfil, cotizaciones, consultas y la vista administrativa. |
| Diseño compartido | `LayoutPrincipalComponent`, `EncabezadoComponent`, `MenuLateralComponent`, `BotonTemaComponent`, `BotonWhatsappComponent`, `FondoCircuitosComponent` | Mantiene la interfaz consistente en las rutas internas. |
| Páginas | `InicioSesionComponent`, `PerfilComponent`, `CotizacionesComponent`, `ConsultasComponent`, `CotizacionesClientesComponent` | Implementan los recorridos mostrados en Figma. |
| Comunicación | `AutenticacionService`, `CotizacionesService`, `EvaluacionService` | Encapsulan las llamadas a NestJS. |

## Componentes del backend

| Componente | Función |
| --- | --- |
| `AuthController` y `AuthService` | Registro, login, perfil y actualización de datos con contraseña actual. |
| `JwtAuthGuard` y `RolesGuard` | Autentican tokens y restringen acciones administrativas. |
| `EvaluationsController` y `EvaluatorService` | Validan una solicitud, consultan FastAPI y guardan su resultado. |
| `QuotesController` | Entrega historial privado y permite solicitar/administrar la coordinación. |
| `PrismaService` | Único acceso a PostgreSQL desde NestJS. |
| `HealthController` | Evidencia de disponibilidad básica del servicio. |

## Flujo principal de una cotización

1. El cliente selecciona una configuración desde Angular.
2. Angular envía la solicitud autenticada a `POST /api/evaluations`.
3. NestJS valida el DTO y el JWT; `EvaluatorService` llama a FastAPI.
4. FastAPI devuelve puntaje, advertencias y recomendaciones.
5. NestJS persiste la cotización con Prisma/PostgreSQL y responde al cliente.
6. El cliente solicita coordinación; un administrador actualiza la atención y continúa la conversación por WhatsApp.
