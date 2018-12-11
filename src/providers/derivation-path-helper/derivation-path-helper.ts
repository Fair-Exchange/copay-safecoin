import { Injectable } from '@angular/core';

@Injectable()
export class DerivationPathHelperProvider {
  public default: string;
  public defaultTestnet: string;
  public defaultBtc: string;
  public defaultBch: string;
  public defaultBtcz: string;
  public defaultLtc: string;
  public defaultZel: string;
  public defaultZen: string;
  public defaultZcl: string;
  public defaultAnon: string;
  public defaultRvn: string;
  public defaultSafe: string;

  public constructor() {
    this.default = "m/44'/0'/0'";
    this.defaultTestnet = "m/44'/1'/0'";
    this.defaultBtc = "m/44'/0'/0'";
    this.defaultBch = "m/44'/0'/0'";
    this.defaultBtcz = "m/44'/177'/0'";
    this.defaultZel = "m/44'/19167'/0'";
    this.defaultZen = "m/44'/121'/0'";
    this.defaultLtc = "m/44'/2'/0'";
    this.defaultZcl = "m/44'/147'/0'";
    this.defaultAnon = "m/44'/19168'/0'";
    this.defaultRvn = "m/44'/175'/0'";
    this.defaultSafe = "m/44'/19165'/0'";
  }

  parse(str: string) {
    var arr = str.split('/');
    var ret = {
      derivationStrategy: '',
      networkName: '',
      cointype: '',
      account: 0
    };

    if (arr[0] != 'm') return false;

    switch (arr[1]) {
      case "44'":
        ret.derivationStrategy = 'BIP44';
        break;
      case "45'":
        return {
          derivationStrategy: 'BIP45',
          networkName: 'livenet',
          account: 0
        };
      case "48'":
        ret.derivationStrategy = 'BIP48';
        break;
      default:
        return false;
    }

    switch (arr[2]) {
      case "0'":
        ret.networkName = 'livenet';
        ret.cointype = '0';
        break;
      case "1'":
        ret.networkName = 'testnet';
        ret.cointype = '1';
        break;
      case "2'":
        ret.networkName = 'livenet';
        ret.cointype = '2';
        break;
      case "121'":
        ret.networkName = 'livenet';
        ret.cointype = '121';
        break;
      case "147'":
        ret.networkName = 'livenet';
        ret.cointype = '147';
        break;
      case "175'":
        ret.networkName = 'livenet';
        ret.cointype = '175';
        break;
      case "177'":
        ret.networkName = 'livenet';
        ret.cointype = '177';
        break;
      case "19165'":
        ret.networkName = 'livenet';
        ret.cointype = '19165';
        break;
      case "19167'":
        ret.networkName = 'livenet';
        ret.cointype = '19167';
        break;
      default:
        return false;
    }

    var match = arr[3].match(/(\d+)'/);
    if (!match) return false;
    ret.account = +match[1];

    return ret;
  }
}
