## Run locally

1. Clone this repository
1. Run from root dir

```
export JWT_SECRET=secret
export OMDB_API_KEY=your_api_key
docker-compose -f docker-compose.yml -f db/docker-compose.yml -f auth-service/docker-compose.yml -f movie-service/docker-compose.yml up --build
```

By default the auth service will start on port `3000` but you can override
the default value by setting the `APP_PORT` env var

```
APP_PORT=8081 JWT_SECRET=secret docker-compose up -d
```

To connect to external database (eg. hosted on Azure), set standard [Postgres environment variables](https://www.postgresql.org/docs/13/libpq-envars.html).

```shell script
export PGHOST=netguru-recruitment.postgres.database.azure.com
docker-compose -f docker-compose.yml -f auth-service/docker-compose.yml -f movie-service/docker-compose.yml up --build
```

After running `docker-compose up`, you can browse documentation at http://localhost:3000/documentation#/
