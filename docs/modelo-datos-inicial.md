# Modelo de datos inicial - EP1

```mermaid
erDiagram
  QUOTE {
    uuid id PK
    string intended_use
    int budget
    int total_price
    int ram_gb
    int storage_gb
    int psu_watts
    int estimated_consumption_watts
    int score
    string level
    json warnings
    json recommendations
    datetime created_at
  }
```

`QUOTE` es la entidad ya persistida con Prisma y PostgreSQL. Las entidades `USER`, `COMPONENT`, `QUOTE_ITEM`, `PRESET` y `PRESET_ITEM` se incorporaran cuando se implemente autenticacion y catalogo administrable.
