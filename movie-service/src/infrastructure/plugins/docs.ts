import { ServerRegisterPluginObject } from '@hapi/hapi';
import HapiSwagger from 'hapi-swagger';

export const docsPlugin: ServerRegisterPluginObject<HapiSwagger.RegisterOptions> = {
  plugin: HapiSwagger,
  options: {
    info: {
      title: 'Netguru Recruitment Task API',
    },
  },
};
