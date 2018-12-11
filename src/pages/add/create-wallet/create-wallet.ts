import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { Logger } from '../../../providers/logger/logger';

// Providers
import { ConfigProvider } from '../../../providers/config/config';
import { DerivationPathHelperProvider } from '../../../providers/derivation-path-helper/derivation-path-helper';
import { OnGoingProcessProvider } from '../../../providers/on-going-process/on-going-process';
import { PopupProvider } from '../../../providers/popup/popup';
import { ProfileProvider } from '../../../providers/profile/profile';
import { PushNotificationsProvider } from '../../../providers/push-notifications/push-notifications';
import {
  Coin_Spec,
  WalletOptions,
  WalletProvider
} from '../../../providers/wallet/wallet';

import * as _ from 'lodash';

@Component({
  selector: 'page-create-wallet',
  templateUrl: 'create-wallet.html'
})
export class CreateWalletPage implements OnInit {
  /* For compressed keys, m*73 + n*34 <= 496 */
  private COPAYER_PAIR_LIMITS = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 4,
    6: 4,
    7: 3,
    8: 3,
    9: 2,
    10: 2,
    11: 1,
    12: 1
  };

  private createForm: FormGroup;
  private defaults;
  private tc: number;
/*  private derivationPathByDefault: string;
  private derivationPathForTestnet: string;
  private derivationPathForBtcz: string;
  private derivationPathForLtc: string;
  private derivationPathForZcl: string;
  private derivationPathForZen: string;
  private derivationPathForZel: string;
  private derivationPathForRvn: string;
  private derivationPathForSafe: string;
*/
  private DerivationPath;
  private Coins = Coin_Spec;

  public copayers: number[];
  public signatures: number[];
  public showAdvOpts: boolean;
  public seedOptions;
  public isShared: boolean;
  public title: string;
  public okText: string;
  public cancelText: string;
//  public coinsname: string[];
//  public coins: string[];
  public CoinsOptions: any = {};

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private fb: FormBuilder,
    private profileProvider: ProfileProvider,
    private configProvider: ConfigProvider,
    private derivationPathHelperProvider: DerivationPathHelperProvider,
    private popupProvider: PopupProvider,
    private onGoingProcessProvider: OnGoingProcessProvider,
    private logger: Logger,
    private walletProvider: WalletProvider,
    private translate: TranslateService,
    private events: Events,
    private pushNotificationsProvider: PushNotificationsProvider
  ) {
    this.DerivationPath = {
      def: this.derivationPathHelperProvider.default,
      safe: this.derivationPathHelperProvider.defaultSafe,
      btcz: this.derivationPathHelperProvider.defaultBtcz,
      zel:  this.derivationPathHelperProvider.defaultZel,
      zen:  this.derivationPathHelperProvider.defaultZen,
      anon: this.derivationPathHelperProvider.defaultAnon,
      zcl:  this.derivationPathHelperProvider.defaultZcl,
      rvn:  this.derivationPathHelperProvider.defaultRvn,
      ltc:  this.derivationPathHelperProvider.defaultLtc,
      btc:  this.derivationPathHelperProvider.default,
//      bch:  this.derivationPathHelperProvider.defaultBch,
      testnet: this.derivationPathHelperProvider.defaultTestnet
    };
    let tmp_i: number = -1;
    for (var iii = 0; iii < this.Coins.length; iii++) {
      if (this.Coins[iii][1] == "1") tmp_i++;
    }
    this.CoinsOptions.value = new Array(tmp_i + 1);
    this.CoinsOptions.description = new Array(tmp_i + 1);
    this.CoinsOptions.disabled = new Array(tmp_i + 1);
    tmp_i = -1;

    for (iii = 0; iii < this.Coins.length; iii++) {
      if (this.Coins[iii][1] == "1") {
         tmp_i++; 
         this.CoinsOptions.value[tmp_i] = this.Coins[iii][0];
         this.CoinsOptions.description[tmp_i] = this.Coins[iii][2];
         this.CoinsOptions.disabled[tmp_i] = "false";
      }
    }


    this.okText = this.translate.instant('Ok');
    this.cancelText = this.translate.instant('Cancel');
/*    this.coins = ['safe', 'btcz', 'zel', 'zen', 'zcl', 'anon', 'rvn', 'ltc', 'btc', 'bch' ];
    this.coinsname = [
     'Safecoin (SAFE)',
     'BitcoinZ (BTCZ)',
     'Anonymous (ANON)',
     'Zelcash (ZEL)',
     'Horizen (ZEN)',
     'Zclassic (ZCL)',
     'Ravencoin (RVN)',
     'Litecoin (LTC)',
     'Bitcoin (BTC)',
     'Bitcoin Cash (BCH)' ];
  */
    this.isShared = this.navParams.get('isShared');
    this.title = this.isShared
      ? this.translate.instant('Create shared wallet')
      : this.translate.instant('Create personal wallet');
    this.defaults = this.configProvider.getDefaults();
    this.tc = this.isShared ? this.defaults.wallet.totalCopayers : 1;

    this.copayers = _.range(2, this.defaults.limits.totalCopayers + 1);
  /*  this.derivationPathByDefault = this.derivationPathHelperProvider.default;
    this.derivationPathForTestnet = this.derivationPathHelperProvider.defaultTestnet;
    this.derivationPathForBtcz = this.derivationPathHelperProvider.defaultBtcz;
    this.derivationPathForLtc = this.derivationPathHelperProvider.defaultLtc;
    this.derivationPathForZcl = this.derivationPathHelperProvider.defaultZcl;
    this.derivationPathForZel = this.derivationPathHelperProvider.defaultZel;
    this.derivationPathForZen = this.derivationPathHelperProvider.defaultZen;
    this.derivationPathForRvn = this.derivationPathHelperProvider.defaultRvn;
    this.derivationPathForSafe = this.derivationPathHelperProvider.defaultSafe; */
    this.showAdvOpts = false;

    this.createForm = this.fb.group({
      walletName: [null, Validators.required],
      myName: [null],
      totalCopayers: [1],
      requiredCopayers: [1],
      bwsURL: [this.defaults.bws.url],
      selectedSeed: ['new'],
      recoveryPhrase: [null],
//      derivationPath: [this.derivationPathByDefault],
      derivationPath: [this.DerivationPath['def']],
      testnetEnabled: [false],
      singleAddress: [false],
      coin: [null, Validators.required]
    });

//    this.createForm.controls['coin'].setValue(this.coins[0]);
    this.createForm.controls['coin'].setValue(this.navParams.data.coin || '');
//    this.createForm.controls['derivationPath'].setValue(this.derivationPathForSafe);
//    this.createForm.controls['derivationPath'].setValue(this.DerivationPath['safe']);
    this.createForm.controls['derivationPath'].setValue(this.DerivationPath['def']);
    this.setTotalCopayers(this.tc);
    this.updateRCSelect(this.tc);
  }

  ngOnInit() {
    if (this.isShared) {
      this.createForm.get('myName').setValidators([Validators.required]);
    }
  }

  public setTotalCopayers(n: number): void {
    this.createForm.controls['totalCopayers'].setValue(n);
    this.updateRCSelect(n);
    this.updateSeedSourceSelect();
  }

  private updateRCSelect(n: number): void {
    this.createForm.controls['totalCopayers'].setValue(n);
    var maxReq = this.COPAYER_PAIR_LIMITS[n];
    this.signatures = _.range(1, maxReq + 1);
    this.createForm.controls['requiredCopayers'].setValue(
      Math.min(Math.trunc(n / 2 + 1), maxReq)
    );
  }

  private updateSeedSourceSelect(): void {
    this.seedOptions = [
      {
        id: 'new',
        label: this.translate.instant('Random'),
        supportsTestnet: true
      },
      {
        id: 'set',
        label: this.translate.instant('Specify Recovery Phrase'),
        supportsTestnet: false
      }
    ];
    this.createForm.controls['selectedSeed'].setValue(this.seedOptions[0].id); // new or set
  }

  public seedOptionsChange(seed): void {
    if (seed === 'set') {
      this.createForm
        .get('recoveryPhrase')
        .setValidators([Validators.required]);
    } else {
      this.createForm.get('recoveryPhrase').setValidators(null);
    }

/*    let path: string = this.createForm.value.coin == 'ltc'
        ? this.derivationPathForLtc
         : this.createForm.value.coin == 'zcl'
          ? this.derivationPathForZcl
           : this.createForm.value.coin == 'rvn'
            ? this.derivationPathForRvn
             : this.createForm.value.coin == 'safe'
              ? this.derivationPathForSafe
               : this.derivationPathByDefault; */
    this.createForm.controls['selectedSeed'].setValue(seed); // new or set
    if (this.createForm.controls['testnet'])
      this.createForm.controls['testnet'].setValue(false);
    this.createForm.controls['derivationPath'].setValue(this.createForm.value.derivationPath);
    this.createForm.controls['recoveryPhrase'].setValue(null);
  }

  public setDerivationPath(): void {
    let path: string = this.createForm.value.testnet
      ? this.DerivationPath['testnet']
       : this.createForm.value.coin
        ? this.DerivationPath[this.createForm.value.coin]
         : this.DerivationPath['def'];
/*    let path: string = this.createForm.value.testnet
      ? this.derivationPathForTestnet
       : this.createForm.value.coin == 'btcz'
        ? this.derivationPathForBtcz
       : this.createForm.value.coin == 'ltc'
        ? this.derivationPathForLtc
         : this.createForm.value.coin == 'zcl'
          ? this.derivationPathForZcl
         : this.createForm.value.coin == 'zel'
          ? this.derivationPathForZel
         : this.createForm.value.coin == 'zen'
          ? this.derivationPathForZen
           : this.createForm.value.coin == 'rvn'
            ? this.derivationPathForRvn
             : this.createForm.value.coin == 'safe'
              ? this.derivationPathForSafe
               : this.derivationPathByDefault; */
    this.createForm.controls['derivationPath'].setValue(path);
  }

  public setOptsAndCreate(): void {
    let opts: Partial<WalletOptions> = {
      name: this.createForm.value.walletName,
      m: this.createForm.value.requiredCopayers,
      n: this.createForm.value.totalCopayers,
      myName:
        this.createForm.value.totalCopayers > 1
          ? this.createForm.value.myName
          : null,
      networkName: this.createForm.value.testnetEnabled ? 'testnet' : 'livenet',
      bwsurl: this.createForm.value.bwsURL,
      singleAddress: this.createForm.value.singleAddress,
      coin: this.createForm.value.coin
    };

    let setSeed = this.createForm.value.selectedSeed == 'set';
    if (setSeed) {
      let words = this.createForm.value.recoveryPhrase || '';
      if (
        words.indexOf(' ') == -1 &&
        words.indexOf('prv') == 1 &&
        words.length > 108
      ) {
        opts.extendedPrivateKey = words;
      } else {
        opts.mnemonic = words;
      }

/*      let pathData =this.derivationPathHelperProvider.parse(this.createForm.value.derivationPath);
      if (this.createForm.value.coin == 'ltc') {
        pathData = this.derivationPathHelperProvider.parse(this.derivationPathForLtc);
      } else if (this.createForm.value.coin == 'zcl') {
        pathData = this.derivationPathHelperProvider.parse(this.derivationPathForZcl);
      } else if (this.createForm.value.coin == 'rvn') {
        pathData = this.derivationPathHelperProvider.parse(this.derivationPathForRvn);
      } else if (this.createForm.value.coin == 'safe') {
        pathData = this.derivationPathHelperProvider.parse(this.derivationPathForSafe);
      }
  */
      let pathData = this.derivationPathHelperProvider.parse(this.createForm.value.derivationPath);
      if (!pathData) {
        let title = this.translate.instant('Error');
        let subtitle = this.translate.instant('Invalid derivation path');
        this.popupProvider.ionicAlert(title, subtitle);
        return;
      }

      opts.networkName = pathData.networkName;
      opts.derivationStrategy = pathData.derivationStrategy;
    }

    if (setSeed && !opts.mnemonic && !opts.extendedPrivateKey) {
      let title = this.translate.instant('Error');
      let subtitle = this.translate.instant(
        'Please enter the wallet recovery phrase'
      );
      this.popupProvider.ionicAlert(title, subtitle);
      return;
    }

    this.create(opts);
  }

  private create(opts): void {
    this.onGoingProcessProvider.set('creatingWallet');

    this.profileProvider
      .createWallet(opts)
      .then(wallet => {
        this.onGoingProcessProvider.clear();
        this.events.publish('status:updated');
        this.walletProvider.updateRemotePreferences(wallet);
        this.pushNotificationsProvider.updateSubscription(wallet);

        if (this.createForm.value.selectedSeed == 'set') {
          this.profileProvider.setBackupFlag(wallet.credentials.walletId);
        }
        this.navCtrl.popToRoot();
        this.events.publish('OpenWallet', wallet);
      })
      .catch(err => {
        this.onGoingProcessProvider.clear();
        this.logger.error('Create: could not create wallet', err);
        let title = this.translate.instant('Error');
        this.popupProvider.ionicAlert(title, err);
        return;
      });
  }
}
