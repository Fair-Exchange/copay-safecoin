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
    safe: `${host}/api.safecoin.org/rates/safe`,
    btcz: `${host}/api.safecoin.org/rates/btcz`,
    zcl: `${host}/api.safecoin.org/rates/zcl`,
    anon: `${host}/api.safecoin.org/rates/anon`,
    zel: `${host}/api.safecoin.org/rates/zel`,
    zen: `${host}/api.safecoin.org/rates/zen`,
    rvn: `${host}/api.safecoin.org/rates/rvn`,
    ltc: `${host}/api.safecoin.org/rates/ltc`
  },
  activateScanner: false
};

export default env;
