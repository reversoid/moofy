
import { Environment } from './Environment';
import { devEnv } from './dev.env';
import { prodEnv } from './prod.config';
import { isDev } from './utils/isDev';
import { isProd } from './utils/isProd';

let environment: Environment;

if (isDev()) {
  environment = devEnv;
} else if (isProd()) {
    environment = prodEnv;
} else {
    throw new Error('App mode must be provided with correct --mode option')
}

export default environment
