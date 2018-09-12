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
    safe: `https://api.safecoin.org/rates/safe`,
    btcz: `https://api.safecoin.org/rates/btcz`,
    zcl: `https://api.safecoin.org/rates/zcl`,
    anon: `https://api.safecoin.org/rates/anon`,
    zel: `https://api.safecoin.org/rates/zel`,
    rvn: `https://api.safecoin.org/rates/rvn`,
    ltc: `https://api.safecoin.org/rates/ltc`
  },
  activateScanner: true
};

export default env;
