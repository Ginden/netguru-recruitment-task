import { get } from 'config';
import { Connection, createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { entities } from '../../db';
import { truncateAllTables } from './helpers';

let connection: Connection;
beforeAll(async () => {
  connection = await createConnection({
    ...get<PostgresConnectionOptions>('typeorm'),
    entities: entities,
    name: 'TEST_CONNECTION',
    synchronize: true,
  });

  await truncateAllTables(connection);
});

afterAll(async () => {
  await connection.close();
});
