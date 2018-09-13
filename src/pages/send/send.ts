import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

// Providers
import { ActionSheetProvider } from '../../providers/action-sheet/action-sheet';
import { AddressBookProvider } from '../../providers/address-book/address-book';
import { AddressProvider } from '../../providers/address/address';
import { AppProvider } from '../../providers/app/app';
import { ExternalLinkProvider } from '../../providers/external-link/external-link';
import { IncomingDataProvider } from '../../providers/incoming-data/incoming-data';
import { Logger } from '../../providers/logger/logger';
import { PopupProvider } from '../../providers/popup/popup';
import { ProfileProvider } from '../../providers/profile/profile';
import { Coin, WalletProvider } from '../../providers/wallet/wallet';
import { WalletTabsProvider } from '../wallet-tabs/wallet-tabs.provider';

// Pages
import { Observable } from 'rxjs/Observable';
import { WalletTabsChild } from '../wallet-tabs/wallet-tabs-child';
import { AmountPage } from './amount/amount';

export interface FlatWallet {
  color: string;
  name: string;
  recipientType: 'wallet';
  coin: Coin;
  network: 'testnet' | 'mainnet';
  m: number;
  n: number;
  needsBackup: boolean;
  isComplete: () => boolean;
  getAddress: () => Promise<string>;
}

@Component({
  selector: 'page-send',
  templateUrl: 'send.html'
})
export class SendPage extends WalletTabsChild {
  public search: string = '';
  public walletsBtc;
  public walletsBch;
  public walletsSafe;
  public walletsBtcz;
  public walletsZcl;
  public walletsAnon;
  public walletsZel;
  public walletsRvn;
  public walletsLtc;
  public walletBchList: FlatWallet[];
  public walletBtcList: FlatWallet[];
  public walletSafeList: FlatWallet[];
  public walletBtczList: FlatWallet[];
  public walletZclList: FlatWallet[];
  public walletAnonList: FlatWallet[];
  public walletZelList: FlatWallet[];
  public walletRvnList: FlatWallet[];
  public walletLtcList: FlatWallet[];
  public contactsList = [];
  public filteredContactsList = [];
  public filteredWallets = [];
  public hasBtcWallets: boolean;
  public hasBchWallets: boolean;
  public hasSafeWallets: boolean;
  public hasBtczWallets: boolean;
  public hasZclWallets: boolean;
  public hasAnonWallets: boolean;
  public hasZelWallets: boolean;
  public hasRvnWallets: boolean;
  public hasLtcWallets: boolean;
  public hasWallets: boolean;
  public hasContacts: boolean;
  public contactsShowMore: boolean;
  private CONTACTS_SHOW_LIMIT: number = 10;
  private currentContactsPage: number = 0;
  private scannerOpened: boolean;

  public amount: string;
  public fiatAmount: number;
  public fiatCode: string;
  public invalidAddress: boolean;

  constructor(
    navCtrl: NavController,
    private navParams: NavParams,
    profileProvider: ProfileProvider,
    private walletProvider: WalletProvider,
    private addressBookProvider: AddressBookProvider,
    private logger: Logger,
    private incomingDataProvider: IncomingDataProvider,
    private popupProvider: PopupProvider,
    private addressProvider: AddressProvider,
    private events: Events,
    walletTabsProvider: WalletTabsProvider,
    private actionSheetProvider: ActionSheetProvider,
    private externalLinkProvider: ExternalLinkProvider,
    private appProvider: AppProvider
  ) {
    super(navCtrl, profileProvider, walletTabsProvider);
  }

  ionViewDidLoad() {
    this.logger.info('ionViewDidLoad SendPage');

    this.events.subscribe('update:address', data => {
      this.search = data.value;
      this.processInput();
    });
  }

  ionViewWillEnter() {
    this.walletsBtc = this.profileProvider.getWallets({ coin: 'btc' });
    this.walletsBch = this.profileProvider.getWallets({ coin: 'bch' });
    this.walletsSafe = this.profileProvider.getWallets({ coin: 'safe' });
    this.walletsBtcz = this.profileProvider.getWallets({ coin: 'btcz' });
    this.walletsZcl = this.profileProvider.getWallets({ coin: 'zcl' });
    this.walletsAnon = this.profileProvider.getWallets({ coin: 'anon' });
    this.walletsZel = this.profileProvider.getWallets({ coin: 'zel' });
    this.walletsRvn = this.profileProvider.getWallets({ coin: 'rvn' });
    this.walletsLtc = this.profileProvider.getWallets({ coin: 'ltc' });
    this.hasBtcWallets = !_.isEmpty(this.walletsBtc);
    this.hasBchWallets = !_.isEmpty(this.walletsBch);
    this.hasSafeWallets = !_.isEmpty(this.walletsSafe);
    this.hasBtczWallets = !_.isEmpty(this.walletsBtcz);
    this.hasZclWallets = !_.isEmpty(this.walletsZcl);
    this.hasAnonWallets = !_.isEmpty(this.walletsAnon);
    this.hasZelWallets = !_.isEmpty(this.walletsZel);
    this.hasRvnWallets = !_.isEmpty(this.walletsRvn);
    this.hasLtcWallets = !_.isEmpty(this.walletsLtc);
    this.walletBchList = this.getBchWalletsList();
    this.walletBtcList = this.getBtcWalletsList();
    this.walletSafeList = this.getSafeWalletsList();
    this.walletBtczList = this.getBtczWalletsList();
    this.walletZclList = this.getZclWalletsList();
    this.walletAnonList = this.getAnonWalletsList();
    this.walletZelList = this.getZelWalletsList();
    this.walletRvnList = this.getRvnWalletsList();
    this.walletLtcList = this.getLtcWalletsList();
    this.updateContactsList();
  }

  ngOnDestroy() {
    this.events.unsubscribe('update:address');
  }

  private getBchWalletsList(): FlatWallet[] {
    return this.hasBchWallets ? this.getRelevantWallets(this.walletsBch) : [];
  }

  private getBtcWalletsList(): FlatWallet[] {
    return this.hasBtcWallets ? this.getRelevantWallets(this.walletsBtc) : [];
  }

  private getSafeWalletsList(): FlatWallet[] {
    return this.hasSafeWallets ? this.getRelevantWallets(this.walletsSafe) : [];
  }

  private getBtczWalletsList(): FlatWallet[] {
    return this.hasBtczWallets ? this.getRelevantWallets(this.walletsBtcz) : [];
  }

  private getZclWalletsList(): FlatWallet[] {
    return this.hasZclWallets ? this.getRelevantWallets(this.walletsZcl) : [];
  }

  private getAnonWalletsList(): FlatWallet[] {
    return this.hasAnonWallets ? this.getRelevantWallets(this.walletsAnon) : [];
  }

  private getZelWalletsList(): FlatWallet[] {
    return this.hasZelWallets ? this.getRelevantWallets(this.walletsZel) : [];
  }

  private getRvnWalletsList(): FlatWallet[] {
    return this.hasRvnWallets ? this.getRelevantWallets(this.walletsRvn) : [];
  }

  private getLtcWalletsList(): FlatWallet[] {
    return this.hasLtcWallets ? this.getRelevantWallets(this.walletsLtc) : [];
  }

  private getRelevantWallets(rawWallets): FlatWallet[] {
    return rawWallets
      .map(wallet => this.flattenWallet(wallet))
      .filter(wallet => this.filterIrrelevantRecipients(wallet));
  }

  private updateContactsList(): void {
    this.addressBookProvider.list().then(ab => {
      this.hasContacts = _.isEmpty(ab) ? false : true;
      if (!this.hasContacts) return;

      let contactsList = [];
      _.each(ab, (v, k: string) => {
        contactsList.push({
          name: _.isObject(v) ? v.name : v,
          address: k,
          network: this.addressProvider.validateAddress(k, v.coin).network,
          email: _.isObject(v) ? v.email : null,
          recipientType: 'contact',
          coin: this.addressProvider.validateAddress(k, v.coin).coin,
          getAddress: () => Promise.resolve(k)
        });
      });
      this.contactsList = contactsList.filter(c =>
        this.filterIrrelevantRecipients(c)
      );
      let shortContactsList = _.clone(
        this.contactsList.slice(
          0,
          (this.currentContactsPage + 1) * this.CONTACTS_SHOW_LIMIT
        )
      );
      this.filteredContactsList = _.clone(shortContactsList);
      this.contactsShowMore =
        this.contactsList.length > shortContactsList.length;
    });
  }

  private flattenWallet(wallet): FlatWallet {
    return {
      color: wallet.color,
      name: wallet.name,
      recipientType: 'wallet',
      coin: wallet.coin,
      network: wallet.network,
      m: wallet.credentials.m,
      n: wallet.credentials.n,
      isComplete: wallet.isComplete(),
      needsBackup: wallet.needsBackup,
      getAddress: () => this.walletProvider.getAddress(wallet, false)
    };
  }

  private filterIrrelevantRecipients(recipient: {
    coin: string;
    network: string;
  }): boolean {
    return this.wallet
      ? this.wallet.coin === recipient.coin &&
          this.wallet.network === recipient.network
      : true;
  }

  public shouldShowZeroState() {
    return (
      this.wallet && this.wallet.status && !this.wallet.status.totalBalanceSat
    );
  }

  public async goToReceive() {
    await this.walletTabsProvider.goToTabIndex(0);
    let coinn ='';
    if (this.wallet.coin){
      if (this.wallet.coin === Coin.SAFE){
        coinn = 'safecoin';
      } else if (this.wallet.coin === Coin.BTCZ){
        coinn = 'bitcoinz';
      } else if (this.wallet.coin === Coin.ANON){
        coinn = 'anonymous';
      } else if (this.wallet.coin === Coin.ZEL){
        coinn = 'zelcash';
      } else if (this.wallet.coin === Coin.ZCL){
        coinn = 'zclassic';
      } else if (this.wallet.coin === Coin.RVN){
        coinn = 'ravencoin';
      } else if (this.wallet.coin === Coin.LTC){
        coinn = 'litecoin'
      } else if (this.wallet.coin === Coin.BTC){
        coinn = 'bitcoin';
      } else if (this.wallet.coin === Coin.BCH){
        coinn = 'bitcoin cash'; 
      }
    }
    const coinName = coinn; 
    const infoSheet = this.actionSheetProvider.createInfoSheet(
      'receiving-bitcoin',
      { coinName }
    );
    await Observable.timer(250).toPromise();
    infoSheet.present();
  }

  public showMore(): void {
    this.currentContactsPage++;
    this.updateContactsList();
  }

  public openScanner(): void {
    this.scannerOpened = true;
    this.walletTabsProvider.setSendParams({
      amount: this.navParams.get('amount'),
      coin: this.navParams.get('coin')
    });
    this.walletTabsProvider.setFromPage({ fromSend: true });
    this.events.publish('ScanFromWallet');
  }

  private checkIfValidAddress(address): void {
    const validAddress = this.addressProvider.checkCoinAndNetwork(
      this.wallet.coin,
      this.wallet.network,
      address
    );
    if (validAddress) {
      this.invalidAddress = false;
      this.incomingDataProvider.redir(this.search, {
        amount: this.navParams.get('amount'),
        coin: this.navParams.get('coin')
      });
      this.search = '';
    } else {
      this.invalidAddress = true;
      if (this.wallet.coin === 'bch') this.checkIfLegacy();
    }
  }

  public processInput(): void {
    if (this.search && this.search.trim() != '') {
      this.searchWallets();
      this.searchContacts();

      if (
        this.filteredContactsList.length === 0 &&
        this.filteredWallets.length === 0
      ) {
        const validData = this.incomingDataProvider.parseData(this.search);
        if (validData && validData.type == 'PayPro') {
          this.incomingDataProvider
            .getPayProDetails(this.search)
            .then(payProDetails => {
              this.checkIfValidAddress(payProDetails.toAddress);
            })
            .catch(err => {
              this.logger.warn(err);
            });
        } else {
          this.checkIfValidAddress(this.search);
        }
      } else {
        this.invalidAddress = false;
      }
    } else {
      this.updateContactsList();
      this.filteredWallets = [];
    }
  }

  private checkIfLegacy() {
    let usingLegacyAddress =
      this.incomingDataProvider.isValidBitcoinCashLegacyAddress(this.search) ||
      this.incomingDataProvider.isValidBitcoinCashUriWithLegacyAddress(
        this.search
      );

    if (usingLegacyAddress) {
      let appName = this.appProvider.info.nameCase;
      const infoSheet = this.actionSheetProvider.createInfoSheet(
        'legacy-address-info',
        { appName }
      );
      infoSheet.present();
      infoSheet.onDidDismiss(option => {
        if (option) {
          let url = 'https://bitpay.github.io/address-translator/';
          this.externalLinkProvider.open(url);
        }
        this.search = '';
      });
    }
  }

  public searchWallets(): void {
    if (this.hasBchWallets && this.wallet.coin === 'bch') {
      this.filteredWallets = this.walletBchList.filter(wallet => {
        return _.includes(wallet.name.toLowerCase(), this.search.toLowerCase());
      });
    }
    if (this.hasBtcWallets && this.wallet.coin === 'btc') {
      this.filteredWallets = this.walletBtcList.filter(wallet => {
        return _.includes(wallet.name.toLowerCase(), this.search.toLowerCase());
      });
    }
    if (this.hasSafeWallets && this.wallet.coin === 'safe') {
      this.filteredWallets = this.walletSafeList.filter(wallet => {
        return _.includes(wallet.name.toLowerCase(), this.search.toLowerCase());
      });
    }
    if (this.hasBtczWallets && this.wallet.coin === 'btcz') {
      this.filteredWallets = this.walletBtczList.filter(wallet => {
        return _.includes(wallet.name.toLowerCase(), this.search.toLowerCase());
      });
    }
    if (this.hasZclWallets && this.wallet.coin === 'zcl') {
      this.filteredWallets = this.walletZclList.filter(wallet => {
        return _.includes(wallet.name.toLowerCase(), this.search.toLowerCase());
      });
    }
    if (this.hasAnonWallets && this.wallet.coin === 'anon') {
      this.filteredWallets = this.walletAnonList.filter(wallet => {
        return _.includes(wallet.name.toLowerCase(), this.search.toLowerCase());
      });
    }
    if (this.hasZelWallets && this.wallet.coin === 'zel') {
      this.filteredWallets = this.walletZelList.filter(wallet => {
        return _.includes(wallet.name.toLowerCase(), this.search.toLowerCase());
      });
    }
    if (this.hasRvnWallets && this.wallet.coin === 'rvn') {
      this.filteredWallets = this.walletRvnList.filter(wallet => {
        return _.includes(wallet.name.toLowerCase(), this.search.toLowerCase());
      });
    }
    if (this.hasLtcWallets && this.wallet.coin === 'ltc') {
      this.filteredWallets = this.walletLtcList.filter(wallet => {
        return _.includes(wallet.name.toLowerCase(), this.search.toLowerCase());
      });
    }
  }

  public searchContacts(): void {
    this.filteredContactsList = _.filter(this.contactsList, item => {
      let val = item.name;
      return _.includes(val.toLowerCase(), this.search.toLowerCase());
    });
  }

  public goToAmount(item): void {
    item
      .getAddress()
      .then((addr: string) => {
        if (!addr) {
          // Error is already formated
          this.popupProvider.ionicAlert('Error - no address');
          return;
        }
        this.logger.debug('Got address:' + addr + ' | ' + item.name);
        this.navCtrl.push(AmountPage, {
          recipientType: item.recipientType,
          amount: parseInt(this.navParams.data.amount, 10),
          toAddress: addr,
          name: item.name,
          email: item.email,
          color: item.color,
          coin: item.coin,
          network: item.network
        });
      })
      .catch(err => {
        this.logger.error('Send: could not getAddress', err);
      });
  }

  public closeCam(): void {
    if (this.scannerOpened) this.events.publish('ExitScan');
    else this.getParentTabs().dismiss();
    this.scannerOpened = false;
  }
}
