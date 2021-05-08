import { Server } from '@hapi/hapi';
import { get } from 'config';
import { routes } from './infrastructure/api';
import { plugins } from './infrastructure/plugins';

const port = get<number>('app.port');

const server: Server = new Server({
  port,
  host: '0.0.0.0',
});

async function bootstrap(s: Server) {
  await server.register(plugins);
  server.route(routes);
  await server.initialize();
  await server.start();
}

if (require.main === module) {
  void bootstrap(server).catch(async (err) => {
    console.error(err);
    await server.stop();
    setTimeout(() => process.exit(1), 50);
  });
}
