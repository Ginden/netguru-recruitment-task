import { Server } from '@hapi/hapi';
import { Connection } from 'typeorm';
import { notNull } from '../../helpers';

export async function truncateAllTables(connection: Connection) {
  const tables: {
    id: string;
    tableName: string;
  }[] = await connection.query(`
      SELECT quote_ident(schemaname) || '.' || quote_ident(tablename) as "id",
             "tablename"                                              AS "tableName"
      FROM pg_catalog.pg_tables
      WHERE schemaname = 'public'
        AND tablename NOT IN ('migrations', 'typeorm_metadata')
  `);

  if (tables.length) {
    await connection.query(
      `TRUNCATE ${tables.map((t) => t.id).join(', ')} CASCADE`,
    );
  }
}

export type Credentials = {
  username: string;
  password: string;
};

export const basicUserLoginData: Credentials = {
  username: 'basic-thomas',
  password: 'sR-_pcoow-27-6PAwCD8',
};

export const premiumUserLoginData: Credentials = {
  username: 'premium-jim',
  password: 'GBLtTyq3E_UNjFnpo9m6',
};

export const longMovies = [
  'Batman Begins',
  'Batman v Superman: Dawn of Justice',
  'Batman',
  'Batman Returns',
  'Batman Forever',
  'Batman & Robin',
  'The Lego Batman Movie',
  'Batman: The Animated Series',
  'Batman: Under the Red Hood',
  'Batman: The Dark Knight Returns, Part 1',
];

export const shortMovies = longMovies.slice(0, 5);

export async function login(
  s: Server,
  credentials: Credentials,
): Promise<{ headers: Record<string, string> }> {
  const res = await s.inject({
    method: 'POST',
    url: '/auth',
    payload: credentials,
  });

  const token = notNull((<any>res.result).token);

  return {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
}
