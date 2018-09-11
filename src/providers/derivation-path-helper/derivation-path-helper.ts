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
  public defaultZcl: string;
  public defaultAnon: string;
  public defaultRvn: string;
  public defaultSafe: string;

  public constructor() {
    this.default = "m/44'/0'/0'";
    this.defaultTestnet = "m/44'/1'/0'";
    this.defaultBtc = "m/44'/0'/0'";
    this.defaultBch = "m/44'/0'/0'";
    this.defaultBtcz = "m/44'/0'/0'";
    this.defaultZel = "m/44'/0'/0'";
    this.defaultLtc = "m/44'/2'/0'";
    this.defaultZcl = "m/44'/147'/0'";
    this.defaultAnon = "m/44'/0'/0'";
    this.defaultRvn = "m/44'/175'/0'";
    this.defaultSafe = "m/44'/19165'/0'";
  }

  parse(str: string) {
    var arr = str.split('/');
    var ret = {
      derivationStrategy: '',
      networkName: '',
      coin: '',
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
        break;
      case "1'":
        ret.networkName = 'testnet';
        break;
      case "2'":
        ret.networkName = 'livenet';
        ret.coin = 'ltc';
        break;
      case "147'":
        ret.networkName = 'livenet';
        ret.coin = 'zcl';
        break;
      case "175'":
        ret.networkName = 'livenet';
        ret.coin = 'rvn';
        break;
      case "19165'":
        ret.networkName = 'livenet';
        ret.coin = 'safe';
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
