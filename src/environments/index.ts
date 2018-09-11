import { EnvironmentSchema } from './schema';

/**
 * Environment: prod
 */
const env: EnvironmentSchema = {
  name: 'production',
  enableAnimations: true,
  ratesAPI: {
    btc: `https://api.coingecko.com/api/v3/coins/bitcoin`,
    bch: `https://api.coingecko.com/api/v3/coins/bitcoin-cash`,
    safe: `https://api.coingecko.com/api/v3/coins/safe-coin-2`,
    btcz: `https://api.coingecko.com/api/v3/coins/bitcoinz`,
    zcl: `https://api.coingecko.com/api/v3/coins/zclassic`,
    anon: `https://api.coingecko.com/api/v3/coins/zclassic`,
    zel: `https://api.coingecko.com/api/v3/coins/zelcash`,
    rvn: `https://api.coingecko.com/api/v3/coins/ravencoin`,
    ltc: `https://api.coingecko.com/api/v3/coins/litecoin`
  },
  activateScanner: true
};

export default env;
