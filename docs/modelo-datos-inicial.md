# Modelo de datos inicial - EP1

```mermaid
erDiagram
  USER ||--o{ QUOTE : crea
  USER {
    uuid id PK
    string name
    string email UK
    string password_hash
    enum role
  }
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
    enum status
    string contact_phone
    string service_address
    datetime preferred_date
    string customer_note
    string admin_note
    json warnings
    json recommendations
    datetime created_at
  }
```

`USER` y `QUOTE` ya se persisten con Prisma y PostgreSQL. Los roles son `CLIENT` y `ADMIN`; los estados de coordinación son `DRAFT`, `REQUESTED`, `REVIEWING`, `SCHEDULED`, `COMPLETED` y `EXPIRED`. Las entidades `COMPONENT`, `QUOTE_ITEM`, `PRESET` y `PRESET_ITEM` se incorporaran con el catálogo administrable.
