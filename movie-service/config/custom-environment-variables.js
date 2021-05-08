module.exports = {
  app: {
    port: 'PORT',
  },
  jwt: {
    secret: 'JWT_SECRET',
  },
  typeorm: {
    host: 'PGHOST',
    port: 'PGPORT',
    username: 'PGUSER',
    password: 'PGPASSWORD',
    database: 'PGDATABASE',
  },
  omdb: {
    apiKey: 'OMDB_API_KEY',
  },
};
