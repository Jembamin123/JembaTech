# ADR-001: NestJS como puerta de entrada unica

## Estado
Aceptada - EP1.

## Decision
Angular/Ionic consume solo NestJS. NestJS valida, autentica, persiste en PostgreSQL y coordina FastAPI. FastAPI contiene la evaluacion especializada y no es accesible desde el navegador.

## Consecuencias
- Se centralizan contratos, errores, CORS y futura seguridad.
- FastAPI puede evolucionar sin romper el frontend.
- Se requieren health checks, timeout y pruebas de integracion.
