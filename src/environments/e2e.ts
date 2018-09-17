import development from './dev';
import { EnvironmentSchema } from './schema';

export const port = 8013;
export const host = `http://localhost:${port}`;

/**
 * Environment: e2e
 */
const env: EnvironmentSchema = {
  // Start with development config,
  ...development,
  // override for e2e testing:
  name: 'e2e',
  enableAnimations: false,
  ratesAPI: {
    btc: `${host}/bitpay.com/api/rates`,
    bch: `${host}/bitpay.com/api/rates/bch`,
    safe: `${host}/api.safecoin.org/safe`,
    btcz: `${host}/api.safecoin.org/btcz`,
    zcl: `${host}/api.safecoin.org/zcl`,
    anon: `${host}/api.safecoin.org/anon`,
    zel: `${host}/api.safecoin.org/zel`,
    rvn: `${host}/api.safecoin.org/rvn`,
    ltc: `${host}/api.safecoin.org/ltc`
  },
  activateScanner: false
};

export default env;
