import { EnvironmentSchema } from './schema';

/**
 * Environment: prod
 */
const env: EnvironmentSchema = {
  name: 'production',
  enableAnimations: true,
  ratesAPI: {
    btc: `https://bitpay.com/api/rates`,
    bch: `https://bitpay.com/api/rates/bch`,
    safe: `https://api.safecoin.org/safe`,
    btcz: `https://api.safecoin.org/btcz`,
    zcl: `https://api.safecoin.org/zcl`,
    anon: `https://api.safecoin.org/anon`,
    zel: `https://api.safecoin.org/zel`,
    rvn: `https://api.safecoin.org/rvn`,
    ltc: `https://api.safecoin.org/ltc`
  },
  activateScanner: true
};

export default env;
