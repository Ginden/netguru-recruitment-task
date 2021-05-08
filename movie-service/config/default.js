module.exports = {
  app: {
    port: 80,
  },
  jwt: {
    secret: null,
  },
  typeorm: {
    type: 'postgres',
    host: null,
    port: 5432,
    username: 'netguru',
    password: 'netguru',
    database: 'netguru',
  },
  omdb: {
    apiKey: null,
  },
};
