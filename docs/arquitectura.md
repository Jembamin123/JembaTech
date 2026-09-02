# Arquitectura inicial - EP1

## Decision

Usaremos una arquitectura de servicios centralizada. El frontend no accede ni a PostgreSQL ni a FastAPI: NestJS es la unica puerta de entrada publica.

## Motivo

Esto concentra autenticacion, validacion, manejo de errores y contratos de API. FastAPI queda aislado como servicio especializado para evaluar compatibilidad y recomendaciones.

## Responsabilidades

| Componente | Responsabilidad |
| --- | --- |
| Ionic + Angular | UX, idiomas, tema claro/oscuro, formularios reactivos y navegacion. |
| NestJS | API REST, usuarios, cotizaciones, presets, autorizacion y coordinacion. |
| PostgreSQL | Persistencia de usuarios, componentes, presets y cotizaciones. |
| FastAPI | Puntaje explicable de configuracion y alertas tecnicas. |

## Fuentes posteriores

SoloTodo sera una fuente candidata de precios/especificaciones para EP2, previa revision de condiciones y frecuencia de consulta. Instagram se conectara solo mediante la API oficial de una cuenta profesional autorizada.
