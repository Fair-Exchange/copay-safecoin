import { Injectable } from '@angular/core';

import { Logger } from '../../providers/logger/logger';

import * as COREBTC from 'bitcore-lib';
import * as COREANON from 'bitcore-lib-anon';
import * as COREBTCZ from 'bitcore-lib-btcz';
import * as COREBCH from 'bitcore-lib-cash';
import * as CORELTC from 'bitcore-lib-ltc';
import * as CORERVN from 'bitcore-lib-rvn';
import * as CORESAFE from 'bitcore-lib-safe';
import * as COREZCL from 'bitcore-lib-zcl';
import * as COREZEL from 'bitcore-lib-zel';
import * as BWC from 'bitcore-wallet-client';

@Injectable()
export class BwcProvider {
  public buildTx = BWC.buildTx;
  public parseSecret = BWC.parseSecret;
  public Client = BWC;
  constructor(private logger: Logger) {
    this.logger.info('BwcProvider initialized.');
  }
  public getBitcore() {
//    return BWC.Bitcore;
      return COREBTC;
  }

  public getBitcoreCash() {
//  return BWC.BitcoreCash;
    return COREBCH;
  }

  public getBitcoreSafe() {
    return CORESAFE;
  }

  public getBitcoreBtcz() {
    return COREBTCZ;
  }

  public getBitcoreZcl() {
    return COREZCL;
  }

  public getBitcoreAnon() {
    return COREANON;
  }

  public getBitcoreZel() {
    return COREZEL;
  }

  public getBitcoreRvn() {
    return CORERVN;
  }

  public getBitcoreLtc() {
    return CORELTC;
  }
  
  public getErrors() {
    return BWC.errors;
  }

  public getSJCL() {
    return BWC.sjcl;
  }

  public getUtils() {
    return BWC.Utils;
  }

  public getClient(walletData?, opts?) {
    opts = opts || {};

    // note opts use `bwsurl` all lowercase;
    let bwc = new BWC({
      baseUrl: opts.bwsurl || 'https://api.safecoin.org/bwss/api',
      verbose: opts.verbose,
      timeout: 100000,
      transports: ['polling']
    });
    if (walletData) bwc.import(walletData, opts);
    return bwc;
  }
}
