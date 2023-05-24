import { Environment } from './Environment';
import { devEnv } from './dev.env';
import { prodEnv } from './prod.env';
import { testEnv } from './test.env';
import { isDev } from './utils/isDev';
import { isProd } from './utils/isProd';
import { isTest } from './utils/isTest';

let environment: Environment;

if (isDev()) {
  environment = devEnv;
} else if (isProd()) {
  environment = prodEnv;
} else if (isTest()) {
  environment = testEnv;
} else {
  throw new Error('App mode must be provided with correct --mode option');
}

export default environment;
