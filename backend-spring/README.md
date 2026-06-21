# ScholarAI Spring Backend

Spring Boot public API gateway for ScholarAI. The frontend calls only this service; Python FastAPI is internal and is reached through `AI_SERVICE_URL` with `X-Internal-Service-Token`.

## Prerequisites

- Java/JDK 25
- Maven wrapper included
- Docker dependencies from `../infra/docker-compose.yml`
- PostgreSQL with pgvector
- Redis

## Environment

The backend reads:

`SPRING_PORT`, `FRONTEND_URL`, `AI_SERVICE_URL`, `AI_SERVICE_TOKEN`, `JWT_SECRET`, `ACCESS_TOKEN_MINUTES`, `REFRESH_TOKEN_DAYS`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `REDIS_HOST`, `REDIS_PORT`, `UPLOAD_DIR`.

## Run

Start dependencies:

```powershell
docker compose -f ..\infra\docker-compose.yml up -d
```

Run the backend:

```powershell
mvn spring-boot:run
```

Google OAuth redirect URI:

```text
http://localhost:8080/login/oauth2/code/google
```
