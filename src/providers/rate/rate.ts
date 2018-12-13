import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import env from '../../environments';
import { Logger } from '../../providers/logger/logger';

@Injectable()
export class RateProvider {
  private alternatives;
  private ratesBTC;
  private ratesBCH;
  private ratesSAFE;
  private ratesBTCZ;
  private ratesRITO;
//  private ratesZCL;
//  private ratesANON;
  private ratesZEL;
  private ratesZEN;
  private ratesRVN;
  private ratesLTC;
  private ratesBtcAvailable: boolean;
  private ratesBchAvailable: boolean;
  private ratesSafeAvailable: boolean;
  private ratesBtczAvailable: boolean;
//  private ratesZclAvailable: boolean;
  private ratesRitoAvailable: boolean;
//  private ratesAnonAvailable: boolean;
  private ratesZelAvailable: boolean;
  private ratesZenAvailable: boolean;
  private ratesRvnAvailable: boolean;
  private ratesLtcAvailable: boolean;

  private SAT_TO_BTC: number;
  private BTC_TO_SAT: number;

  private btcrateServiceUrl = env.ratesAPI.btc;
  private bchRateServiceUrl = env.ratesAPI.bch;
  private safeRateServiceUrl = env.ratesAPI.safe;
  private btczRateServiceUrl = env.ratesAPI.btcz;
//  private zclRateServiceUrl = env.ratesAPI.zcl;
  private ritoRateServiceUrl = env.ratesAPI.rito;
//  private anonRateServiceUrl = env.ratesAPI.anon;
  private zelRateServiceUrl = env.ratesAPI.zel;
  private zenRateServiceUrl = env.ratesAPI.zen;
  private rvnRateServiceUrl = env.ratesAPI.rvn;
  private ltcRateServiceUrl = env.ratesAPI.ltc;
/*  private names = {
    aed:  'UAE Dirham (AED)',
    ars:  'Argentine Peso (ARS)',
    aud:  'Australian Dollar (AUD)',
    bch:  'Bitcoin Cash (BCH)',
    bdt:  'Bangladeshi Taka (BDT)',
    bhd:  'Bahraini Dinar (BHD)',
    bmd:  'Bermudan Dollar (BMD)',
    brl:  'Brazilian Real (BRL)',
    btc:  'Bitcoin (BTC)',
    cad:  'Canadian Dollar (CAD)',
    chf:  'Swiss Franc (CHF)',
    clp:  'Chilean Peso (CLP)',
    cny:  'Chinese Yuan (CNY)',
    czk:  'Czech Koruna (CZK)',
    dkk:  'Danish Krone (DKK)',
    eth:  'Ethereum (ETH)',
    eur:  'Eurozone Euro (EUR)',
    gbp:  'Pound Sterling (GBP)',
    hkd:  'Hong Kong Dollar (HKD)',
    huf:  'Hungarian Forint (HUF)',
    idr:  'Indonesian Rupiah (IDR)',
    ils:  'Israeli Shekel (ILS)',
    inr:  'Indian Rupee (INR)',
    jpy:  'Japanese Yen (JPY)',
    krw:  'South Korean Won (KRW)',
    kwd:  'Kuwaiti Dinar (KWD)',
    lkr:  'Sri Lankan Rupee (LKR)',
    ltc:  'Litecoin (LTC)',
    mmk:  'Myanma Kyat (MMK)',
    mxn:  'Mexican Peso (MXN)',
    myr:  'Malaysian Ringgit (MYR)',
    nok:  'Norwegian Krone (NOK)',
    nzd:  'New Zealand Dollar (NZD)',
    php:  'Philippine Peso (PHP)',
    pkr:  'Pakistani Rupee (PKR)',
    pln:  'Polish Zloty (PLN)',
    rub:  'Russian Ruble (RUB)',
    sar:  'Saudi Riyal (SAR)',
    sek:  'Swedish Krona (SEK)',
    sgd:  'Singapore Dollar (SGD)',
    thb:  'Thai Baht (THB)',
    try:  'Turkish Lira (TRY)',
    twd:  'New Taiwan Dollar (TWD)',
    usd:  'US Dollar (USD)',
    vef:  'Venezuelan Bolívar Fuerte (VEF)',
    xag:  'Silver (troy ounce) (XAG)',
    xau:  'Gold (troy ounce) (XAU)',
    zar:  'South African Rand'
  };
  private codes = {
    aed:  'AED',
    ars:  'ARS',
    aud:  'AUD',
    bch:  'BCH',
    bdt:  'BDT',
    bhd:  'BHD',
    bmd:  'BMD',
    brl:  'BRL',
    btc:  'BTC',
    cad:  'CAD',
    chf:  'CHF',
    clp:  'CLP',
    cny:  'CNY',
    czk:  'CZK',
    dkk:  'DKK',
    eth:  'ETH',
    eur:  'EUR',
    gbp:  'GBP',
    hkd:  'HKD',
    huf:  'HUF',
    idr:  'IDR',
    ils:  'ILS',
    inr:  'INR',
    jpy:  'JPY',
    krw:  'KRW',
    kwd:  'KWD',
    lkr:  'LKR',
    ltc:  'LTC',
    mmk:  'MMK',
    mxn:  'MXN',
    myr:  'MYR',
    nok:  'NOK',
    nzd:  'NZD',
    php:  'PHP',
    pkr:  'PKR',
    pln:  'PLN',
    rub:  'RUB',
    sar:  'SAR',
    sek:  'SEK',
    sgd:  'SGD',
    thb:  'THB',
    try:  'TRY',
    twd:  'TWD',
    usd:  'USD',
    vef:  'VEF',
    xag:  'XAG',
    xau:  'XAU',
    zar:  'ZAR',
};
  */


  constructor(private http: HttpClient, private logger: Logger) {
    this.logger.info('RateProvider initialized.');
    this.alternatives = [];
    this.ratesBTC = {};
    this.ratesBCH = {};
    this.ratesSAFE = {};
    this.ratesBTCZ = {};
//    this.ratesZCL = {};
    this.ratesRITO = {};
//    this.ratesANON = {};
    this.ratesZEL = {};
    this.ratesZEN = {};
    this.ratesRVN = {};
    this.ratesLTC = {};
    this.SAT_TO_BTC = 1 / 1e8;
    this.BTC_TO_SAT = 1e8;
    this.ratesBtcAvailable = false;
    this.ratesBchAvailable = false;
    this.ratesSafeAvailable = false;
    this.ratesBtczAvailable = false;
    this.ratesLtcAvailable = false;
    this.updateRatesBtc();
    this.updateRatesBch();
    this.updateRatesSafe();
    this.updateRatesBtcz();
    this.updateRatesLtc();
    this.updateRatesZel();
    this.updateRatesZen();
//    this.updateRatesZcl();
    this.updateRatesRito();
//    this.updateRatesAnon();
    this.updateRatesRvn();
  }

  public updateRatesBtc(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getBTC()
        .then(dataBTC => {
          _.each(dataBTC, currency => {
            this.ratesBTC[currency.code] = currency.rate;
            this.alternatives.push({
              name: currency.name,
              isoCode: currency.code,
              rate: currency.rate
            });
          });
          this.ratesBtcAvailable = true;
          resolve();
        })
        .catch(errorBTC => {
          this.logger.error(errorBTC);
          reject(errorBTC);
        });
    });
  }
  public updateRatesSafe(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getSAFE()
        .then(dataSAFE => {
          _.each(dataSAFE, currency => {
            this.ratesSAFE[currency.code] = currency.rate;
          });
          this.ratesSafeAvailable = true;
          resolve();
        })
        .catch(errorSAFE => {
          this.logger.error(errorSAFE);
          reject(errorSAFE);
        });
    });
  }

  public updateRatesBtcz(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getBTCZ()
        .then(dataBTCZ => {
          _.each(dataBTCZ, currency => {
            this.ratesBTCZ[currency.code] = currency.rate;
          });
          this.ratesBtczAvailable = true;
          resolve();
        })
        .catch(errorBTCZ => {
          this.logger.error(errorBTCZ);
          reject(errorBTCZ);
        });
    });
  }
/*  public updateRatesZcl(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getZCL()
        .then(dataZCL => {
          _.each(dataZCL, currency => {
            this.ratesZCL[currency.code] = currency.rate;
          });
          this.ratesZclAvailable = true;
          resolve();
        })
        .catch(errorZCL => {
          this.logger.error(errorZCL);
          reject(errorZCL);
        });
    });
  }

*/  public updateRatesRito(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getRITO()
        .then(dataRITO => {
          _.each(dataRITO, currency => {
            this.ratesRITO[currency.code] = currency.rate;
          });
          this.ratesRitoAvailable = true;
          resolve();
        })
        .catch(errorRITO => {
          this.logger.error(errorRITO);
          reject(errorRITO);
        });
    });
  }

/*  public updateRatesAnon(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getANON()
        .then(dataANON => {
          _.each(dataANON, currency => {
            this.ratesANON[currency.code] = currency.rate;
          });
          this.ratesAnonAvailable = true;
          resolve();
        })
        .catch(errorANON => {
          this.logger.error(errorANON);
          reject(errorANON);
        });
    });
  }
  */
  public updateRatesZel(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getZEL()
        .then(dataZEL => {
          _.each(dataZEL, currency => {
            this.ratesZEL[currency.code] = currency.rate;
          });
          this.ratesZelAvailable = true;
          resolve();
        })
        .catch(errorZEL => {
          this.logger.error(errorZEL);
          reject(errorZEL);
        });
    });
  }

  public updateRatesZen(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getZEN()
        .then(dataZEN => {
          _.each(dataZEN, currency => {
            this.ratesZEN[currency.code] = currency.rate;
          });
          this.ratesZenAvailable = true;
          resolve();
        })
        .catch(errorZEN => {
          this.logger.error(errorZEN);
          reject(errorZEN);
        });
    });
  }

  public updateRatesRvn(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getRVN()
        .then(dataRVN => {
          _.each(dataRVN, currency => {
            this.ratesRVN[currency.code] = currency.rate;
          });
          this.ratesRvnAvailable = true;
          resolve();
        })
        .catch(errorRVN => {
          this.logger.error(errorRVN);
          reject(errorRVN);
        });
    });
  }

  public updateRatesLtc(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getLTC()
        .then(dataLTC => {
          _.each(dataLTC, currency => {
            this.ratesLTC[currency.code] = currency.rate;
          });
          this.ratesLtcAvailable = true;
          resolve();
        })
        .catch(errorLTC => {
          this.logger.error(errorLTC);
          reject(errorLTC);
        });
    });
  }
      
  public updateRatesBch(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getBCH()
        .then(dataBCH => {
          _.each(dataBCH, currency => {
            this.ratesBCH[currency.code] = currency.rate;
          });
          this.ratesBchAvailable = true;
          resolve();
        })
        .catch(errorBCH => {
          this.logger.error(errorBCH);
          reject(errorBCH);
        });
    });
  }
    
  public getBTC(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.btcrateServiceUrl).subscribe(data => {
        resolve(data);
      });
    });
  }
  public getSAFE(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.safeRateServiceUrl).subscribe(data => {
        resolve(data);
      });
    });
  }
  public getBTCZ(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.btczRateServiceUrl).subscribe(data => {
        resolve(data);
      });
    });
  }
/*  public getZCL(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.zclRateServiceUrl).subscribe(data => {
        resolve(data);
      });
    });
  }
*/  public getRITO(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.ritoRateServiceUrl).subscribe(data => {
        resolve(data);
      });
    });
  }
/*  public getANON(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.anonRateServiceUrl).subscribe(data => {
        resolve(data);
      });
    });
  } */
  public getZEL(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.zelRateServiceUrl).subscribe(data => {
        resolve(data);
      });
    });
  }
  public getZEN(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.zenRateServiceUrl).subscribe(data => {
        resolve(data);
      });
    });
  }
  public getRVN(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.rvnRateServiceUrl).subscribe(data => {
        resolve(data);
      });
    });
  }
  public getLTC(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.ltcRateServiceUrl).subscribe(data => {
        resolve(data);
      });
    });
  }

  public getBCH(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.bchRateServiceUrl).subscribe(data => {
        resolve(data);
      });
    });
  }
  
  public getRate(code: string, chain?: string): number {
    if (chain == 'btc') return this.ratesBTC[code];
    else if (chain == 'bch') return this.ratesBCH[code];
    else if (chain == 'safe') return this.ratesSAFE[code];
    else if (chain == 'btcz') return this.ratesBTCZ[code];
//    else if (chain == 'zcl') return this.ratesZCL[code];
    else if (chain == 'rito') return this.ratesRITO[code];
//    else if (chain == 'anon') return this.ratesANON[code];
    else if (chain == 'zel') return this.ratesZEL[code];
    else if (chain == 'zen') return this.ratesZEL[code];
    else if (chain == 'rvn') return this.ratesRVN[code];
    else return this.ratesLTC[code];
  }

  public getAlternatives() {
    return this.alternatives;
  }

  public isBtcAvailable() {
    return this.ratesBtcAvailable;
  }

  public isSafeAvailable() {
    return this.ratesSafeAvailable;
  }

  public isBtczAvailable() {
    return this.ratesBtczAvailable;
  }
/*  public isZclAvailable() {
    return this.ratesZclAvailable;
  }
*/  public isRitoAvailable() {
    return this.ratesRitoAvailable;
  }
/*  public isAnonAvailable() {
    return this.ratesAnonAvailable;
  } */
  public isZelAvailable() {
    return this.ratesZelAvailable;
  }
  public isZenAvailable() {
    return this.ratesZelAvailable;
  }
  public isRvnAvailable() {
    return this.ratesRvnAvailable;
  }

  public isLtcAvailable() {
    return this.ratesLtcAvailable;
  }

  public isBchAvailable() {
    return this.ratesBchAvailable;
  }
  
  public toFiat(satoshis: number, code: string, chain: string): number {
    if (
      (!this.isBtcAvailable() && chain == 'btc') ||
      (!this.isSafeAvailable() && chain == 'safe') ||
      (!this.isBtczAvailable() && chain == 'btcz') ||
//      (!this.isZclAvailable() && chain == 'zcl') ||
      (!this.isRitoAvailable() && chain == 'rito') ||
//      (!this.isAnonAvailable() && chain == 'anon') ||
      (!this.isZelAvailable() && chain == 'zel') ||
      (!this.isZenAvailable() && chain == 'zen') ||
      (!this.isRvnAvailable() && chain == 'rvn') ||
      (!this.isLtcAvailable() && chain == 'ltc') ||
      (!this.isBchAvailable() && chain == 'bch')
    ) {
      return null;
    }
    return satoshis * this.SAT_TO_BTC * this.getRate(code, chain);
  }

  public fromFiat(amount: number, code: string, chain: string): number {
    if (
      (!this.isBtcAvailable() && chain == 'btc') ||
      (!this.isSafeAvailable() && chain == 'safe') ||
      (!this.isBtczAvailable() && chain == 'btcz') ||
//      (!this.isZclAvailable() && chain == 'zcl') ||
      (!this.isRitoAvailable() && chain == 'rito') ||
//      (!this.isAnonAvailable() && chain == 'anon') ||
      (!this.isZelAvailable() && chain == 'zel') ||
      (!this.isZenAvailable() && chain == 'zen') ||
      (!this.isRvnAvailable() && chain == 'rvn') ||
      (!this.isLtcAvailable() && chain == 'ltc') ||
      (!this.isBchAvailable() && chain == 'bch')
    ) {
      return null;
    }
    return (amount / this.getRate(code, chain)) * this.BTC_TO_SAT;
  }

  public listAlternatives(sort: boolean) {
    let alternatives = _.map(this.getAlternatives(), (item: any) => {
      return {
        name: item.name,
        isoCode: item.isoCode
      };
    });
    if (sort) {
      alternatives.sort((a, b) => {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      });
    }
    return _.uniqBy(alternatives, 'isoCode');
  }

  public whenRatesAvailable(chain: string): Promise<any> {
    return new Promise(resolve => {
      if (
        (this.ratesBtcAvailable && chain == 'btc') ||
        (this.ratesSafeAvailable && chain == 'safe') ||
        (this.ratesBtczAvailable && chain == 'btcz') ||
//        (this.ratesZclAvailable && chain == 'zcl') ||
        (this.ratesRitoAvailable && chain == 'rito') ||
//        (this.ratesAnonAvailable && chain == 'anon') ||
        (this.ratesZelAvailable && chain == 'zel') ||
        (this.ratesZenAvailable && chain == 'zen') ||
        (this.ratesRvnAvailable && chain == 'rvn') ||
        (this.ratesLtcAvailable && chain == 'ltc')  ||
        (this.ratesBchAvailable && chain == 'bch')
      )
        resolve();
      else {
        if (chain == 'btc') {
          this.updateRatesBtc().then(() => {
            resolve();
          });
        }
        if (chain == 'bch') {
          this.updateRatesBch().then(() => {
            resolve();
          });
        } 
        if (chain == 'safe') {
          this.updateRatesSafe().then(() => {
            resolve();
          });
        }
        if (chain == 'btcz') {
          this.updateRatesBtcz().then(() => {
            resolve();
          });
        }
/*        if (chain == 'zcl') {
          this.updateRatesZcl().then(() => {
            resolve();
          });
        }
*/        if (chain == 'rito') {
          this.updateRatesRito().then(() => {
            resolve();
          });
        }
/*        if (chain == 'anon') {
          this.updateRatesAnon().then(() => {
            resolve();
          });
        } */
        if (chain == 'zel') {
          this.updateRatesZel().then(() => {
            resolve();
          });
        }
        if (chain == 'zen') {
          this.updateRatesZen().then(() => {
            resolve();
          });
        }
        if (chain == 'rvn') {
          this.updateRatesRvn().then(() => {
            resolve();
          });
        }
        if (chain == 'ltc') {
          this.updateRatesLtc().then(() => {
            resolve();
          });
        }
      } 
    });
  }
}
