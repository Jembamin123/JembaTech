# JembaTech

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

1. La persona crea una cuenta o inicia sesion como cliente.
2. Selecciona componentes compatibles y solicita la evaluacion.
3. Angular envia la solicitud autenticada a NestJS.
4. NestJS consulta FastAPI para obtener el puntaje y luego persiste la cotizacion privada en PostgreSQL.
5. La persona puede solicitar coordinacion; JembaTech gestiona el estado y el cierre se realiza por WhatsApp.

La integracion con SoloTodo e Instagram se incorpora en EP2 mediante mecanismos autorizados; no se hara scraping sin validar condiciones de uso.

## Navegacion y roles del frontend

Angular Router separa las vistas en componentes cargados de forma diferida y un `PortalLayoutComponent` reutilizable conserva logo, navegacion lateral, tema y acceso a WhatsApp.

- `/login`: acceso y registro publico.
- `/perfil`: datos personales y cambio seguro de contrasena; requiere sesion.
- `/cotizaciones`: historial privado del cliente; requiere sesion.
- `/consultas`: seguimiento de coordinaciones; requiere sesion.
- `/admin/cotizaciones-clientes`: gestion de cotizaciones recibidas; requiere rol `ADMIN`.

Los guards del frontend mejoran la experiencia de navegacion. La autorizacion efectiva se valida nuevamente en NestJS, por lo que ocultar una opcion en la interfaz no reemplaza la seguridad del backend.

## Requisitos

- Docker Desktop con Docker Compose.
- Node.js 22 para ejecutar los proyectos sin contenedores.
- Python 3.12 para ejecutar o probar FastAPI localmente.
- Terraform >= 1.6 para validar la infraestructura preliminar.

## Ejecutar con Docker Compose

1. Copia `.env.example` como `.env`, cambia la contrasena local y define una clave aleatoria larga para `JWT_SECRET`.
2. Ejecuta:

```bash
docker compose up --build
```

Servicios disponibles: frontend `http://localhost:4200`, API `http://localhost:3000/api`, FastAPI `http://localhost:8000` y PostgreSQL `localhost:5432`.

Para detener el ambiente:

```bash
docker compose down
```

## Endpoints principales

- `GET /api/health`: estado de NestJS.
- `POST /api/auth/register` y `POST /api/auth/login`: crean una cuenta o emiten una sesion JWT.
- `GET /api/auth/me`: devuelve el perfil autenticado.
- `PATCH /api/auth/me`: actualiza nombre, telefono o contrasena validando primero la contrasena actual.
- `POST /api/evaluations`: recibe presupuesto, uso, RAM, almacenamiento y consumo; exige sesion y guarda la cotizacion del cliente.
- `GET /api/quotes`: devuelve el historial privado del cliente; un `ADMIN` ve las cotizaciones recibidas.
- `PATCH /api/quotes/:id/request`: el cliente solicita coordinacion y agrega datos de contacto.
- `PATCH /api/quotes/:id/coordination`: un `ADMIN` actualiza estado, fecha y nota interna.
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

Los ejemplos de configuracion estan en `.env.example`, `python-service/.env.example` y `frontend/.env.example`. Los valores reales no se versionan. En GitHub Actions, los valores sensibles se agregaran como **Secrets** y los no sensibles como **Variables**.

## Alcance y limitaciones de EP1

Esta primera entrega demuestra la arquitectura, autenticacion JWT y roles, el flujo Angular-NestJS-FastAPI, PostgreSQL con Prisma y migraciones, contenerizacion, pipeline y Terraform preliminar. Aun faltan PWA/Capacitor, fuente web autorizada y despliegue cloud; se implementaran incrementalmente en las siguientes etapas.

## Prototipo y fuentes web

El prototipo Figma y la fuente web autorizada se definiran y enlazaran antes del cierre de EP1. SoloTodo e Instagram no se consumen en esta etapa para respetar terminos de uso y privacidad.
