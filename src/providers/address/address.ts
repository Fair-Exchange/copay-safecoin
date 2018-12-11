import { Injectable } from '@angular/core';

// Providers
import { BwcProvider } from '../../providers/bwc/bwc';

@Injectable()
export class AddressProvider {
  private bitcore;
//  private bitcoreCash;
  private bitcoreSafe;
  private bitcoreBtcz;
  private bitcoreZcl;
  private bitcoreAnon;
  private bitcoreZel;
  private bitcoreZen;
  private bitcoreRvn;
  private bitcoreLtc;
  private Bitcore;

  constructor(private bwcProvider: BwcProvider) {
    this.bitcore = this.bwcProvider.getBitcore();
//    this.bitcoreCash = this.bwcProvider.getBitcoreCash();
    this.bitcoreSafe = this.bwcProvider.getBitcoreSafe();
    this.bitcoreBtcz = this.bwcProvider.getBitcoreBtcz();
    this.bitcoreZcl = this.bwcProvider.getBitcoreZcl();
    this.bitcoreAnon = this.bwcProvider.getBitcoreAnon();
    this.bitcoreZel = this.bwcProvider.getBitcoreZel();
    this.bitcoreZen = this.bwcProvider.getBitcoreZen();
    this.bitcoreRvn = this.bwcProvider.getBitcoreRvn();
    this.bitcoreLtc = this.bwcProvider.getBitcoreLtc();
    this.Bitcore = {
      btc: {
        lib: this.bitcore,
        translateTo: 'btc'
      },
/*      bch: {
        lib: this.bitcoreCash,
        translateTo: 'btc'
      }, */
      btcz: {
        lib: this.bitcoreBtcz,
        translateTo: 'btcz'
      },
      zcl: {
        lib: this.bitcoreZcl,
        translateTo: 'zcl'
      },
      anon: {
        lib: this.bitcoreAnon,
        translateTo: 'anon'
      },
      zel: {
        lib: this.bitcoreZel,
        translateTo: 'zel'
      },
      zen: {
        lib: this.bitcoreZen,
        translateTo: 'zen'
      },
      rvn: {
        lib: this.bitcoreRvn,
        translateTo: 'rvn'
      },
      ltc: {
        lib: this.bitcoreLtc,
        translateTo: 'ltc'
      },
      safe: {
        lib: this.bitcoreSafe,
        translateTo: 'safe'
      }
    };
  }

  public getCoin(address: string) {
//  debugger;
    try {
      new this.Bitcore['btc'].lib.Address(address);
      return 'btc';
    } catch (e) {
      try {
//        new this.Bitcore['bch'].lib.Address(address);
//        return 'bch';
//      } catch (e) {
//        try {
          new this.Bitcore['safe'].lib.Address(address);
          return 'safe';
        } catch (e) {
          try {
            new this.Bitcore['btcz'].lib.Address(address);
            return 'btcz';
          } catch (e) {
            try {
              new this.Bitcore['rvn'].lib.Address(address);
              return 'rvn';
            } catch (e) {
              try {
              //  new this.Bitcore['zcl'].lib.Address(address);
              //  return 'zcl';
             // } catch (e) {
              //  try {
                  new this.Bitcore['ltc'].lib.Address(address);
                  return 'ltc';
                } catch (e) {
                  return null;
               // }
              }
            }
          }
        // }
      }
    }
  }

  private translateAddress(address: string) {
//  debugger;
  var origCoin = this.getCoin(address);
    if (!origCoin) return undefined;

    var origAddress = new this.Bitcore[origCoin].lib.Address(address);
    var origObj = origAddress.toObject();

    var resultCoin = this.Bitcore[origCoin].translateTo;
    var resultAddress = this.Bitcore[resultCoin].lib.Address.fromObject(
      origObj
    );
    return {
      origCoin,
      origAddress: address,
      resultCoin,
      resultAddress: resultAddress.toString()
    };
  }

  public validateAddress(address: string, coiN: string) {
    if (coiN == 'Safecoin (SAFE)') coiN = 'safe';
    if (coiN == 'Litecoin (LTC)') coiN = 'ltc';
    if (coiN == 'Bitcoin (BTC)') coiN = 'btc';
//    if (coiN == 'Bitcoin Cash (BCH)') coiN = 'bch';
    if (coiN == 'BitcoinZ (BTCZ)') coiN = 'btcz';
    if (coiN == 'Zelcash (ZEL)') coiN = 'zel';
    if (coiN == 'Horizen (ZEN)') coiN = 'zen';
//    if (coiN == 'Zclassic (ZCL)') coiN = 'zcl';
//    if (coiN == 'ANONymous (ANON)') coiN = 'anon';
    if (coiN == 'Ravencoin (RVN)') coiN = 'rvn';

    if (coiN == 'safe' ) {
      let AddressSafe = this.bitcoreSafe.Address;
      let isLivenetSafe = AddressSafe.isValid(address, 'livenet');
      return {
        address,
        isValid: isLivenetSafe,
        network: 'livenet',
        coin: coiN,
        translation: {}
      };
    } else if (coiN == 'btcz') {
      let AddressBtcz = this.bitcoreBtcz.Address;
      let isLivenetBtcz = AddressBtcz.isValid(address, 'livenet');
      return {
        address,
        isValid: isLivenetBtcz,
        network: 'livenet',
        coin: coiN,
        translation: {}
      };
    } else if (coiN == 'anon' ) {
      let AddressAnon = this.bitcoreAnon.Address;
      let isLivenetAnon = AddressAnon.isValid(address, 'livenet');
      return {
        address,
        isValid: isLivenetAnon,
        network: 'livenet',
        coin: coiN,
        translation: {}
      };
    } else if (coiN == 'zel') {
      let AddressZel = this.bitcoreZel.Address;
      let isLivenetZel = AddressZel.isValid(address, 'livenet');
      return {
        address,
        isValid: isLivenetZel,
        network: 'livenet',
        coin: coiN,
        translation: {}
      };
    } else if (coiN == 'zen') {
      let AddressZen = this.bitcoreZen.Address;
      let isLivenetZen = AddressZen.isValid(address, 'livenet');
      return {
        address,
        isValid: isLivenetZen,
        network: 'livenet',
        coin: coiN,
        translation: {}
      };
    } else if (coiN == 'zcl' ) {
      let AddressZcl = this.bitcoreZcl.Address;
      let isLivenetZcl = AddressZcl.isValid(address, 'livenet');
      return {
        address,
        isValid: isLivenetZcl,
        network: 'livenet',
        coin: coiN,
        translation: {}
      };
    } else if (coiN == 'ltc' ) {
      let AddressLtc = this.bitcoreLtc.Address;
      let isLivenetLtc = AddressLtc.isValid(address, 'livenet');
      return {
        address,
        isValid: isLivenetLtc,
        network: 'livenet',
        coin: coiN,
        translation: {}
      };
    } else if (coiN == 'rvn' ){
      let AddressRvn = this.bitcoreRvn.Address;
      let isLivenetRvn = AddressRvn.isValid(address, 'livenet');
      return {
        address,
        isValid: isLivenetRvn,
        network: 'livenet',
        coin: coiN,
        translation: {}
      };
    } else {
      let Address = this.bitcore.Address;
//      let AddressCash = this.bitcoreCash.Address;
      let isLivenet = Address.isValid(address, 'livenet');
      let isTestnet = Address.isValid(address, 'testnet');
//      let isLivenetCash = AddressCash.isValid(address, 'livenet');
//      let isTestnetCash = AddressCash.isValid(address, 'testnet');
      return {
        address,
        isValid: isLivenet || isTestnet, // || isLivenetCash || isTestnetCash,
        network: isTestnet /*|| isTestnetCash*/ ? 'testnet' : 'livenet',
        coin: coiN,
        translation: this.translateAddress(address)
      };
    }
  }

  public checkCoinAndNetwork(
    coin: string,
    network: string,
    address: string
  ): boolean {
    let addressData;
    if (this.isValid(address)) {
      let extractedAddress = this.extractAddress(address);
      addressData = this.validateAddress(extractedAddress, coin);
      return addressData.coin == coin
        ? addressData.network == network
          ? addressData.isValid
            ? true
            : false
          : false
        : false;
    } else {
      return false;
    }
  }

  public extractAddress(address: string): string {
    let extractedAddress = address
//      .replace(/^(bitcoincash:|bitcoin:|safecoin:|bitcoinz:|zclassic:|anonymous:|zelcash:|zen:|ravencoin:|litecoin:)/, '')
      .replace(/^(bitcoin:|safecoin:|bitcoinz:|zclassic:|anonymous:|zelcash:|zen:|ravencoin:|litecoin:)/, '')
      .replace(/\?.*/, '');
    return extractedAddress || address;
  }

  public isValid(address: string): boolean {




    let URI = this.bitcore.URI;
    let Address = this.bitcore.Address;
//    let URICash = this.bitcoreCash.URI;
//    let AddressCash = this.bitcoreCash.Address;
    let URISafe = this.bitcoreSafe.URI;
    let AddressSafe = this.bitcoreSafe.Address;
    let URIBtcz = this.bitcoreBtcz.URI;
    let AddressBtcz = this.bitcoreBtcz.Address;
    let URIZcl = this.bitcoreZcl.URI;
    let AddressZcl = this.bitcoreZcl.Address;
    let URIAnon = this.bitcoreAnon.URI;
    let AddressAnon = this.bitcoreAnon.Address;
    let URIZel = this.bitcoreZel.URI;
    let AddressZel = this.bitcoreZel.Address;
    let URIZen = this.bitcoreZen.URI;
    let AddressZen = this.bitcoreZen.Address;
    let URIRvn = this.bitcoreRvn.URI;
    let AddressRvn = this.bitcoreRvn.Address;
    let URILtc = this.bitcoreLtc.URI;
    let AddressLtc = this.bitcoreLtc.Address;

    // Bip21 uri
    let uri, isAddressValidLivenet, isAddressValidTestnet;
    if (/^bitcoin:/.test(address)) {
      let isUriValid = URI.isValid(address);
      if (isUriValid) {
        uri = new URI(address);
        isAddressValidLivenet = Address.isValid(
          uri.address.toString(),
          'livenet'
        );
        isAddressValidTestnet = Address.isValid(
          uri.address.toString(),
          'testnet'
        );
      }
      if (isUriValid && (isAddressValidLivenet || isAddressValidTestnet)) {
        return true;
      }
/*    } else if (/^bitcoincash:/.test(address)) {
      let isUriValid = URICash.isValid(address);
      if (isUriValid) {
        uri = new URICash(address);
        isAddressValidLivenet = AddressCash.isValid(
          uri.address.toString(),
          'livenet'
        );
        isAddressValidTestnet = AddressCash.isValid(
          uri.address.toString(),
          'testnet'
        );
      }
      if (isUriValid && (isAddressValidLivenet || isAddressValidTestnet)) {
        return true;
      }*/
    } else if (/^safecoin:/.test(address)) {
      let isUriValid = URISafe.isValid(address);
      if (isUriValid) {
        uri = new URISafe(address);
        isAddressValidLivenet = AddressSafe.isValid(
          uri.address.toString(),
          'livenet'
        );
      }
      if (isUriValid && isAddressValidLivenet /* || isAddressValidTestnet) */) {
        return true;
      }
    } else if (/^bitcoinz:/.test(address)) {
      let isUriValid = URIBtcz.isValid(address);
      if (isUriValid) {
        uri = new URIBtcz(address);
        isAddressValidLivenet = AddressBtcz.isValid(
          uri.address.toString(),
          'livenet'
        );
      }
      if (isUriValid && isAddressValidLivenet /* || isAddressValidTestnet) */) {
        return true;
      }
    } else if (/^zclassic:/.test(address)) {
      let isUriValid = URIZcl.isValid(address);
      if (isUriValid) {
        uri = new URIZcl(address);
        isAddressValidLivenet = AddressZcl.isValid(
          uri.address.toString(),
          'livenet'
        );
      }
      if (isUriValid && isAddressValidLivenet /* || isAddressValidTestnet) */) {
        return true;
      }
    } else if (/^anonymous:/.test(address)) {
      let isUriValid = URIAnon.isValid(address);
      if (isUriValid) {
        uri = new URIAnon(address);
        isAddressValidLivenet = AddressAnon.isValid(
          uri.address.toString(),
          'livenet'
        );
      }
      if (isUriValid && isAddressValidLivenet /* || isAddressValidTestnet) */) {
        return true;
      }
    } else if (/^zelcash:/.test(address)) {
      let isUriValid = URIZel.isValid(address);
      if (isUriValid) {
        uri = new URIZel(address);
        isAddressValidLivenet = AddressZel.isValid(
          uri.address.toString(),
          'livenet'
        );
      }
      if (isUriValid && isAddressValidLivenet /* || isAddressValidTestnet) */) {
        return true;
      }
    } else if (/^zen:/.test(address)) {
      let isUriValid = URIZen.isValid(address);
      if (isUriValid) {
        uri = new URIZen(address);
        isAddressValidLivenet = AddressZen.isValid(
          uri.address.toString(),
          'livenet'
        );
      }
      if (isUriValid && isAddressValidLivenet /* || isAddressValidTestnet) */) {
        return true;
      }
    } else if (/^ravencoin:/.test(address)) {
      let isUriValid = URIRvn.isValid(address);
      if (isUriValid) {
        uri = new URIRvn(address);
        isAddressValidLivenet = AddressRvn.isValid(
          uri.address.toString(),
          'livenet'
        );
      }
      if (isUriValid && isAddressValidLivenet /* || isAddressValidTestnet) */) {
        return true;
      }
    } else if (/^litecoin:/.test(address)) {
      let isUriValid = URILtc.isValid(address);
      if (isUriValid) {
        uri = new URILtc(address);
        isAddressValidLivenet = AddressLtc.isValid(
          uri.address.toString(),
          'livenet'
        );
      }
      if (isUriValid && isAddressValidLivenet /* || isAddressValidTestnet) */) {
        return true;
      }
    }

    // Regular Address: try Bitcoin and Bitcoin Cash
    let regularAddressLivenet = Address.isValid(address, 'livenet');
//    let regularAddressTestnet = Address.isValid(address, 'testnet');
//    let regularAddressCashLivenet = AddressCash.isValid(address, 'livenet');
//    let regularAddressCashTestnet = AddressCash.isValid(address, 'testnet');
    let regularAddressSafeLivenet = AddressSafe.isValid(address, 'livenet');
    let regularAddressBtczLivenet = AddressBtcz.isValid(address, 'livenet');
    let regularAddressZelLivenet = AddressZel.isValid(address, 'livenet');
    let regularAddressZenLivenet = AddressZen.isValid(address, 'livenet');
//    let regularAddressZclLivenet = AddressZcl.isValid(address, 'livenet');
//    let regularAddressAnonLivenet = AddressAnon.isValid(address, 'livenet');
    let regularAddressRvnLivenet = AddressRvn.isValid(address, 'livenet');
    let regularAddressLtcLivenet = AddressLtc.isValid(address, 'livenet');
    if (
      regularAddressLivenet ||
//      regularAddressTestnet ||
      regularAddressSafeLivenet ||
      regularAddressBtczLivenet ||
      regularAddressZelLivenet ||
      regularAddressZenLivenet ||
//      regularAddressZclLivenet ||
//      regularAddressAnonLivenet ||
      regularAddressRvnLivenet ||
      regularAddressLtcLivenet 
//      regularAddressCashLivenet 
//      regularAddressCashTestnet
    ) {
      return true;
    }

    return false;
  }
}
