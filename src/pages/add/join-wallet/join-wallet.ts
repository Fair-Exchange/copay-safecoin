import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { App, Events, NavController, NavParams } from 'ionic-angular';

// Pages
import { ScanPage } from '../../scan/scan';
import { TabsPage } from '../../tabs/tabs';

// Providers
import { ActionSheetProvider } from '../../../providers/action-sheet/action-sheet';
import { ConfigProvider } from '../../../providers/config/config';
import { DerivationPathHelperProvider } from '../../../providers/derivation-path-helper/derivation-path-helper';
import { Logger } from '../../../providers/logger/logger';
import { OnGoingProcessProvider } from '../../../providers/on-going-process/on-going-process';
import { PopupProvider } from '../../../providers/popup/popup';
import { ProfileProvider } from '../../../providers/profile/profile';
import { PushNotificationsProvider } from '../../../providers/push-notifications/push-notifications';
import {
  Coin_Spec,
  WalletOptions,
  WalletProvider
} from '../../../providers/wallet/wallet';

@Component({
  selector: 'page-join-wallet',
  templateUrl: 'join-wallet.html'
})
export class JoinWalletPage {
  private defaults;
  public showAdvOpts: boolean;
  public seedOptions;
  public okText: string;
  public cancelText: string;
//  public coins: string[];
  public CoinsOptions: any = {};

  private joinForm: FormGroup;
  private regex: RegExp;
/*  private derivationPathByDefault: string;
  private derivationPathForTestnet: string;
  private derivationPathForBtcz: string;
  private derivationPathForZcl: string;
  private derivationPathForLtc: string;
  private derivationPathForZen: string;
  private derivationPathForZel: string;
  private derivationPathForRvn: string;
  private derivationPathForSafe: string;*/
  private DerivationPath;
  private Coins = Coin_Spec;

  constructor(
    private app: App,
    private configProvider: ConfigProvider,
    private form: FormBuilder,
    private navCtrl: NavController,
    private navParams: NavParams,
    private derivationPathHelperProvider: DerivationPathHelperProvider,
    private onGoingProcessProvider: OnGoingProcessProvider,
    private popupProvider: PopupProvider,
    private profileProvider: ProfileProvider,
    private walletProvider: WalletProvider,
    private logger: Logger,
    private translate: TranslateService,
    private events: Events,
    private pushNotificationsProvider: PushNotificationsProvider,
    private actionSheetProvider: ActionSheetProvider
  ) {
      this.DerivationPath = {
      def: this.derivationPathHelperProvider.default,
      safe: this.derivationPathHelperProvider.defaultSafe,
      btcz: this.derivationPathHelperProvider.defaultBtcz,
      zel:  this.derivationPathHelperProvider.defaultZel,
      zen:  this.derivationPathHelperProvider.defaultZen,
      anon: this.derivationPathHelperProvider.defaultAnon,
      zcl:  this.derivationPathHelperProvider.defaultZcl,
      rito:  this.derivationPathHelperProvider.defaultRito,
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
    this.defaults = this.configProvider.getDefaults();
/*    this.derivationPathByDefault = this.derivationPathHelperProvider.default;
    this.derivationPathForTestnet = this.derivationPathHelperProvider.defaultTestnet;
    this.derivationPathForLtc = this.derivationPathHelperProvider.defaultLtc;
    this.derivationPathForBtcz = this.derivationPathHelperProvider.defaultBtcz;
    this.derivationPathForZcl = this.derivationPathHelperProvider.defaultZcl;
    this.derivationPathForZen = this.derivationPathHelperProvider.defaultZen;
    this.derivationPathForZel = this.derivationPathHelperProvider.defaultZel;
    this.derivationPathForRvn = this.derivationPathHelperProvider.defaultRvn;
    this.derivationPathForSafe = this.derivationPathHelperProvider.defaultSafe;
    this.coins = ['safe', 'btcz', 'zel', 'zen', 'zcl', 'anon', 'rvn', 'ltc', 'btc', 'bch' ];*/

    this.showAdvOpts = false;

    this.regex = /^[0-9A-HJ-NP-Za-z]{70,80}$/; // For invitationCode
    this.joinForm = this.form.group({
      myName: [null, Validators.required],
      invitationCode: [
        null,
        [Validators.required, Validators.pattern(this.regex)]
      ], // invitationCode == secret
      bwsURL: [this.defaults.bws.url],
      selectedSeed: ['new'],
      recoveryPhrase: [null],
//      derivationPath: [this.derivationPathByDefault],
      derivationPath: [this.DerivationPath['def']],
      coin: [null, Validators.required]
    });
    this.joinForm.controls['coin'].setValue(this.navParams.data.coin || '');
    this.joinForm.controls['derivationPath'].setValue(this.DerivationPath['def']);

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
    this.events.subscribe('update:invitationCode', data => {
      let invitationCode = data.value.replace('copay:', '');
      this.onQrCodeScannedJoin(invitationCode);
    });
  }
  public setDerivationPath(): void {
    let path: string = this.joinForm.value.testnet
      ? this.DerivationPath['testnet']
       : this.joinForm.value.coin
        ? this.DerivationPath[this.joinForm.value.coin]
         : this.DerivationPath['def'];
    this.joinForm.controls['derivationPath'].setValue(path);
  }

  ionViewDidLoad() {
    this.logger.info('ionViewDidLoad JoinWalletPage');
  }

  ionViewWillEnter() {
    if (this.navParams.data.url) {
      let data: string = this.navParams.data.url;
      data = data.replace('copay:', '');
      this.onQrCodeScannedJoin(data);
    }
  }

  ngOnDestroy() {
    this.events.unsubscribe('update:invitationCode');
  }

  public onQrCodeScannedJoin(data: string): void {
    if (this.regex.test(data)) {
      this.joinForm.controls['invitationCode'].setValue(data);
    } else {
      const errorInfoSheet = this.actionSheetProvider.createInfoSheet(
        'default-error',
        {
          msg: this.translate.instant('Invalid data'),
          title: this.translate.instant('Error')
        }
      );
      errorInfoSheet.present();
    }
  }

  public seedOptionsChange(seed): void {
    if (seed === 'set') {
      this.joinForm.get('recoveryPhrase').setValidators([Validators.required]);
    } else {
      this.joinForm.get('recoveryPhrase').setValidators(null);
    }
    this.joinForm.controls['selectedSeed'].setValue(seed);
  }

  public setOptsAndJoin(): void {
    let opts: Partial<WalletOptions> = {
      secret: this.joinForm.value.invitationCode,
      myName: this.joinForm.value.myName,
      bwsurl: this.joinForm.value.bwsURL,
      coin: this.joinForm.value.coin
    };

    let setSeed = this.joinForm.value.selectedSeed == 'set';
    if (setSeed) {
      let words = this.joinForm.value.recoveryPhrase;
      if (
        words.indexOf(' ') == -1 &&
        words.indexOf('prv') == 1 &&
        words.length > 108
      ) {
        opts.extendedPrivateKey = words;
      } else {
        opts.mnemonic = words;
      }

      let pathData = this.derivationPathHelperProvider.parse(
        this.joinForm.value.derivationPath
      );
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

    this.join(opts);
  }

  private join(opts): void {
    this.onGoingProcessProvider.set('joiningWallet');

    this.profileProvider
      .joinWallet(opts)
      .then(wallet => {
        this.onGoingProcessProvider.clear();
        this.events.publish('status:updated');
        this.walletProvider.updateRemotePreferences(wallet);
        this.pushNotificationsProvider.updateSubscription(wallet);
        this.app
          .getRootNavs()[0]
          .setRoot(TabsPage)
          .then(() => {
            this.events.publish('OpenWallet', wallet);
          });
      })
      .catch(err => {
        this.onGoingProcessProvider.clear();
        let title = this.translate.instant('Error');
        this.popupProvider.ionicAlert(title, err);
        return;
      });
  }

  public openScanner(): void {
    this.navCtrl.push(ScanPage, { fromJoin: true });
  }
}
