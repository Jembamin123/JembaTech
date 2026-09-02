# Jemba Cotiza

Aplicacion multiplataforma para crear cotizaciones de PC, elegir presets y recibir una evaluacion explicable de compatibilidad, rendimiento esperado y ajuste al presupuesto.

## Arquitectura EP1

`Ionic + Angular` se comunica solo con `NestJS`. NestJS administra PostgreSQL y consulta internamente el evaluador `FastAPI`.

```text
Frontend (4200) -> NestJS (3000) -> PostgreSQL (5432)
                           -> FastAPI (8000)
```

## Carpetas

- `frontend/`: cliente Ionic + Angular.
- `backend/`: API principal NestJS y acceso a datos.
- `python-service/`: evaluador de configuraciones con FastAPI.
- `infra/`: Terraform inicial para staging.
- `docs/`: arquitectura y decisiones.

## Primer flujo demostrable

1. La persona selecciona un preset o define su uso y presupuesto.
2. Angular envia la solicitud a NestJS.
3. NestJS guarda la cotizacion y consulta FastAPI.
4. FastAPI retorna puntaje, advertencias y explicacion.
5. NestJS entrega el resultado al frontend.

La integracion con SoloTodo e Instagram se incorpora en EP2 mediante mecanismos autorizados; no se hara scraping sin validar condiciones de uso.
