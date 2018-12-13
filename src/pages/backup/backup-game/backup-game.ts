import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  Events,
  Navbar,
  NavController,
  NavParams,
  Slides
} from 'ionic-angular';
import * as _ from 'lodash';
import { Logger } from '../../../providers/logger/logger';

// pages
import { DisclaimerPage } from '../../onboarding/disclaimer/disclaimer';

// providers
import { ActionSheetProvider } from '../../../providers/action-sheet/action-sheet';
import { BwcProvider } from '../../../providers/bwc/bwc';
import { OnGoingProcessProvider } from '../../../providers/on-going-process/on-going-process';
import { ProfileProvider } from '../../../providers/profile/profile';
import { Coin_Spec, WalletProvider } from '../../../providers/wallet/wallet';

@Component({
  selector: 'page-backup-game',
  templateUrl: 'backup-game.html'
})
export class BackupGamePage {
  @ViewChild(Slides)
  slides: Slides;
  @ViewChild(Navbar)
  navBar: Navbar;

  public fromOnboarding: boolean;

  private Coins = Coin_Spec;

  public currentIndex: number;
  public deleted: boolean;
  public copying: boolean = false;
  public mnemonicWords: string[];
  public shuffledMnemonicWords;
  public password: string;
  public customWords;
  public selectComplete: boolean;
  public error: boolean;
  public credentialsEncrypted: boolean;

  private mnemonicHasPassphrase;
  private walletId: string;
  private wallet;
  private keys;
  private useIdeograms;

  constructor(
    private events: Events,
    private navCtrl: NavController,
    private navParams: NavParams,
    private logger: Logger,
    private profileProvider: ProfileProvider,
    private walletProvider: WalletProvider,
    private bwcProvider: BwcProvider,
    private onGoingProcessProvider: OnGoingProcessProvider,
    private translate: TranslateService,
    public actionSheetProvider: ActionSheetProvider
  ) {
    this.walletId = this.navParams.get('walletId');
    this.fromOnboarding = this.navParams.get('fromOnboarding');
    this.wallet = this.profileProvider.getWallet(this.walletId);
    this.credentialsEncrypted = this.wallet.isPrivKeyEncrypted();
  }

  ionViewDidEnter() {
    this.deleted = this.isDeletedSeed();
    if (this.deleted) {
      this.logger.debug('no mnemonics');
      return;
    }

    this.walletProvider
      .getKeys(this.wallet)
      .then(keys => {
        if (_.isEmpty(keys)) {
          this.logger.warn('Empty keys');
        }
        this.credentialsEncrypted = false;
        this.keys = keys;
        this.setFlow();
      })
      .catch(err => {
        if (err && err.message != 'FINGERPRINT_CANCELLED') {
          let title = this.translate.instant('Could not decrypt wallet');
          this.showErrorInfoSheet(err, title);
        }
        this.navCtrl.pop();
      });
  }

  ngOnInit() {
    this.currentIndex = 0;
    this.navBar.backButtonClick = () => {
      if (this.slides) this.slidePrev();
      else this.navCtrl.pop();
    };
  }

  ionViewDidLoad() {
    if (this.slides) this.slides.lockSwipes(true);
  }

  public openWarningModal(): void {
    let tmp_w = '';
    let tmp_c = this.wallet.coin;
    let tmp_m = this.mnemonicWords;

//    let tmp_cthis.shuffledMnemonicWords
    for (var iii = this.shuffledMnemonicWords.length; iii > 0; iii--) {
      tmp_w = tmp_w + ' '+ this.shuffledMnemonicWords[iii-1].word;
    }
    const infoSheet = this.actionSheetProvider.createInfoSheet(
      'backup-warning2',
      { msg: tmp_w }
    );
    infoSheet.present();
    infoSheet.onDidDismiss(option => {
      if (option) {
        tmp_w = '';
        for (var iii = 0 ; iii <this.mnemonicWords.length; iii++) {
          tmp_w = tmp_w + ' '+ this.mnemonicWords[iii];
        }
        let index = this.Coins.indexOf(this.Coins.filter(function foo(item) {return item[0] == tmp_c})[0]);
        tmp_w = this.Coins[index][2] + " (m/44'/" + this.Coins[index][3] + "'/0'/0):" + tmp_w;
        const infoSheet2 = this.actionSheetProvider.createInfoSheet( 'backup-warning3', { msg: tmp_w } );
        infoSheet2.present();
        infoSheet2.onDidDismiss(option => {
          if (option) {
            var newWord;
//            var tmp_lw;
            this.customWords = [];
            for (var jjj = 0 ; jjj < tmp_m.length; jjj++) {
              for (iii = 0 ; iii < this.shuffledMnemonicWords.length; iii++) {
                if ( this.mnemonicWords[jjj] == this.shuffledMnemonicWords[iii].word) {
                  newWord = {word: this.mnemonicWords[jjj], prevIndex: iii};
                  this.customWords.push(newWord);
                  this.shuffledMnemonicWords[iii].selected = true;
                  this.copying = false;
                  iii = this.shuffledMnemonicWords.length;
                }
              }
            }
            this.shouldContinue();
          }
        });
      }
    });
  }

  private showErrorInfoSheet(
    err: Error | string,
    infoSheetTitle: string
  ): void {
    if (!err) return;
    this.logger.warn('Could not get keys:', err);
    const errorInfoSheet = this.actionSheetProvider.createInfoSheet(
      'default-error',
      { msg: err, title: infoSheetTitle }
    );
    errorInfoSheet.present();
  }

  private shuffledWords(words: string[]) {
    var sort = _.sortBy(words);

    return _.map(sort, w => {
      return {
        word: w,
        selected: false
      };
    });
  }

  public addButton(index: number, item): void {
    var newWord = {
      word: item.word,
      prevIndex: index
    };
    this.customWords.push(newWord);
    this.shuffledMnemonicWords[index].selected = true;
    if (this.customWords.length == 4) this.copying = true;
    if (this.customWords.length != 4) this.copying = false;

    this.shouldContinue();
  }

  public removeButton(index: number, item): void {
    // if ($scope.loading) return;
    this.customWords.splice(index, 1);
    if (this.customWords.length == 4) this.copying = true;
    if (this.customWords.length != 4) this.copying = false;
    this.shuffledMnemonicWords[item.prevIndex].selected = false;
    this.shouldContinue();
  }

  private shouldContinue(): void {
    this.selectComplete =
      this.customWords.length === this.shuffledMnemonicWords.length
        ? true
        : false;
  }

  private isDeletedSeed(): boolean {
    if (
      !this.wallet.credentials.mnemonic &&
      !this.wallet.credentials.mnemonicEncrypted
    )
      return true;

    return false;
  }

  private slidePrev(): void {
    this.slides.lockSwipes(false);
    if (this.currentIndex == 0) this.navCtrl.pop();
    else {
      this.slides.slidePrev();
      this.currentIndex = this.slides.getActiveIndex();
    }
    this.slides.lockSwipes(true);
  }

  public slideNext(reset: boolean): void {
    if (reset) {
      this.resetGame();
    }

    if (this.currentIndex == 1 && !this.mnemonicHasPassphrase) this.finalStep();
    else {
      this.slides.lockSwipes(false);
      this.slides.slideNext();
    }

    this.currentIndex = this.slides.getActiveIndex();
    this.slides.lockSwipes(true);
  }

  private resetGame() {
    this.customWords = [];
    this.shuffledMnemonicWords.forEach(word => {
      word.selected = false;
    });
    this.selectComplete = false;
  }

  private setFlow(): void {
    if (!this.keys) return;

    let words = this.keys.mnemonic;

    this.mnemonicWords = words.split(/[\u3000\s]+/);
    this.shuffledMnemonicWords = this.shuffledWords(this.mnemonicWords);
    this.mnemonicHasPassphrase = this.wallet.mnemonicHasPassphrase();
    this.useIdeograms = words.indexOf('\u3000') >= 0;
    this.password = '';
    this.customWords = [];
    this.selectComplete = false;
    this.error = false;

    words = _.repeat('x', 300);

    if (this.currentIndex == 2) this.slidePrev();
  }

  private confirm(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.error = false;

      let customWordList = _.map(this.customWords, 'word');

      if (!_.isEqual(this.mnemonicWords, customWordList)) {
        return reject('Mnemonic string mismatch');
      }

      if (this.mnemonicHasPassphrase) {
        let walletClient = this.bwcProvider.getClient();
        let separator = this.useIdeograms ? '\u3000' : ' ';
        let customSentence = customWordList.join(separator);
        let password = this.password || '';

        try {
          walletClient.seedFromMnemonic(customSentence, {
            network: this.wallet.credentials.network,
            password,
            account: this.wallet.credentials.account
          });
        } catch (err) {
          walletClient.credentials.xPrivKey = _.repeat('x', 64);
          return reject(err);
        }

        if (
          walletClient.credentials.xPrivKey.substr(
            walletClient.credentials.xPrivKey
          ) != this.keys.xPrivKey
        ) {
          delete walletClient.credentials;
          return reject('Private key mismatch');
        }
      }

      this.profileProvider.setBackupFlag(this.wallet.credentials.walletId);
      return resolve();
    });
  }

  private finalStep(): void {
    this.onGoingProcessProvider.set('validatingWords');
    this.confirm()
      .then(() => {
        this.onGoingProcessProvider.clear();
        const walletType =
          this.wallet.coin === 'btc' 
           ? 'bitcoin' 
            : this.wallet.coin === 'safe' 
              ? 'safecoin'
               : this.wallet.coin === 'btcz' 
                 ? 'bitcoinz'
                  : this.wallet.coin === 'zcl' 
                   ? 'zclassic'
                  : this.wallet.coin === 'rito' 
                   ? 'ritocoin'
                  : this.wallet.coin === 'anon' 
                   ? 'anonymous'
                  : this.wallet.coin === 'zel' 
                   ? 'zelcash'
                  : this.wallet.coin === 'zen' 
                   ? 'zen'
                    : this.wallet.coin === 'rvn' 
                     ? 'ravencoin'
                      : this.wallet.coin === 'ltc' 
                       ? 'litecoin'
                        : 'bitcoin cash';
        const infoSheet = this.actionSheetProvider.createInfoSheet(
          'backup-ready',
          { walletType }
        );
        infoSheet.present();
        infoSheet.onDidDismiss(() => {
          if (this.fromOnboarding) {
            this.navCtrl.push(DisclaimerPage);
          } else {
            this.navCtrl.popToRoot();
            this.events.publish('Wallet/setAddress');
          }
        });
      })
      .catch(err => {
        this.onGoingProcessProvider.clear();
        this.logger.warn('Failed to verify backup: ', err);
        this.error = true;
        const infoSheet = this.actionSheetProvider.createInfoSheet(
          'backup-failed'
        );
        infoSheet.present();
        infoSheet.onDidDismiss(() => {
          this.setFlow();
        });
      });
  }
}
