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
3. NestJS consulta FastAPI para obtener el puntaje y luego persiste el resultado en PostgreSQL.
4. FastAPI retorna puntaje, advertencias y explicacion.
5. NestJS entrega el resultado al frontend y conserva un historial de las ultimas cotizaciones.

La integracion con SoloTodo e Instagram se incorpora en EP2 mediante mecanismos autorizados; no se hara scraping sin validar condiciones de uso.

## Requisitos

- Docker Desktop con Docker Compose.
- Node.js 22 para ejecutar los proyectos sin contenedores.
- Python 3.12 para ejecutar o probar FastAPI localmente.
- Terraform >= 1.6 para validar la infraestructura preliminar.

## Ejecutar con Docker Compose

1. Copia `.env.example` como `.env` y cambia la contrasena local de PostgreSQL.
2. Ejecuta:

```bash
docker compose up --build
```

Servicios disponibles: frontend `http://localhost:4200`, API `http://localhost:3000/api`, FastAPI `http://localhost:8000` y PostgreSQL `localhost:5432`.

Para detener el ambiente:

```bash
docker compose down
```

## Endpoints iniciales

- `GET /api/health`: estado de NestJS.
- `POST /api/evaluations`: recibe presupuesto, uso, RAM, almacenamiento y consumo; NestJS delega el puntaje a FastAPI.
- `GET /api/quotes`: devuelve las ultimas 20 cotizaciones persistidas en PostgreSQL.
- `GET /health` en el puerto 8000: estado de FastAPI.
- `POST /evaluate` en el puerto 8000: evaluacion interna de una configuracion.

## Pruebas

```bash
cd python-service
pip install -r requirements.txt -r requirements-dev.txt
python -m pytest -q
```

## Pipeline e infraestructura

El workflow [CI EP1](.github/workflows/ci.yml) construye Angular, NestJS y FastAPI, ejecuta pruebas Python, detecta secretos y construye las tres imagenes Docker. La configuracion inicial de staging y las instrucciones de validacion se encuentran en [`infra/`](infra/README.md).

## Variables y secretos

Los ejemplos de configuracion estan en `.env.example`, `backend/.env.example`, `python-service/.env.example` y `frontend/.env.example`. Los valores reales no se versionan. En GitHub Actions, los valores sensibles se agregaran como **Secrets** y los no sensibles como **Variables**.

## Alcance y limitaciones de EP1

Esta primera entrega demuestra la arquitectura, el flujo Angular-NestJS-FastAPI, PostgreSQL con Prisma y migraciones, contenerizacion, pipeline y Terraform preliminar. Aun faltan autenticacion/autorizacion, PWA/Capacitor, fuente web autorizada y despliegue cloud; se implementaran incrementalmente en las siguientes etapas.

## Prototipo y fuentes web

El prototipo Figma y la fuente web autorizada se definiran y enlazaran antes del cierre de EP1. SoloTodo e Instagram no se consumen en esta etapa para respetar terminos de uso y privacidad.
