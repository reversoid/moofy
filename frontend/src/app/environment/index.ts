import { Environment } from './Environment';
import { devEnvLocal } from './dev.local.env';
import { devEnvRemote } from './dev.remote.env';
import { prodEnv } from './prod.env';
import { testEnv } from './test.env';
import { isDevLocal } from './utils/isDevLocal';
import { isDevRemote } from './utils/isDevRemote';
import { isProd } from './utils/isProd';
import { isTest } from './utils/isTest';

let environment: Environment;

if (isDevRemote()) {
  environment = devEnvRemote;
} else if (isDevLocal()) {
  environment = devEnvLocal;
} else if (isProd()) {
  environment = prodEnv;
} else if (isTest()) {
  environment = testEnv;
} else {
  throw new Error('App mode must be provided with correct --mode option');
}

export default environment;
