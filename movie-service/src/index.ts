import { Server } from '@hapi/hapi';
import { get } from 'config';
import { routes } from './api';
import { plugins } from './infrastructure/plugins';

export async function bootstrap(s: Server) {
  await s.register(plugins);
  s.route(routes);
  await s.initialize();
  await s.start();
}

if (require.main === module) {
  const port = get<number>('app.port');

  const server: Server = new Server({
    port,
    host: '0.0.0.0',
  });

  void bootstrap(server).catch(async (err) => {
    console.error(err);
    await server.stop();
    setTimeout(() => process.exit(1), 50);
  });

  process.on('SIGTERM', () => server.stop());
}
