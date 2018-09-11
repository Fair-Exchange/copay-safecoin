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
    btc: `${host}/api.coingecko.com/api/v3/coins/bitcoin`,
    bch: `${host}/api.coingecko.com/api/v3/coins/bitcoin-cash`,
    safe: `${host}/api.coingecko.com/api/v3/coins/safe-coin-2`,
    btcz: `${host}/api.coingecko.com/api/v3/coins/bitcoinz`,
    zcl: `${host}/api.coingecko.com/api/v3/coins/zclassic`,
    anon: `${host}/api.coingecko.com/api/v3/coins/zclassic`,
    zel: `${host}/api.coingecko.com/api/v3/coins/zelcash`,
    rvn: `${host}/api.coingecko.com/api/v3/coins/ravencoin`,
    ltc: `${host}/api.coingecko.com/api/v3/coins/litecoin`
  },
  activateScanner: false
};

export default env;
