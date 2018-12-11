import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams } from 'ionic-angular';

// Pages
import { AmountPage } from '../../../../pages/send/amount/amount';

// Providers
import { AddressBookProvider } from '../../../../providers/address-book/address-book';
// import { AddressProvider } from '../../../../providers/address/address';
import { BwcProvider } from '../../../../providers/bwc/bwc';
import { PopupProvider } from '../../../../providers/popup/popup';

@Component({
  selector: 'page-addressbook-view',
  templateUrl: 'view.html'
})
export class AddressbookViewPage {
  public contact;
  public address: string;
  public name: string;
  public note: string;
  public email: string;
  public coinname: string;
  public coin: string;
  public network: string;

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
//  private coin: string;

  constructor(
    private addressBookProvider: AddressBookProvider,
//    private addressProvider: AddressProvider,
    private bwcProvider: BwcProvider,
    private navCtrl: NavController,
    private navParams: NavParams,
    private popupProvider: PopupProvider,
    private translate: TranslateService
  ) {
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
    this.address = this.navParams.data.contact.address;
    this.name = this.navParams.data.contact.name;
    this.email = this.navParams.data.contact.email;
    this.coinname = this.navParams.data.contact.coin;
    this.note = this.navParams.data.contact.note;
    this.network = this.navParams.data.contact.network || 'livenet';

    const btcAddress = this.bitcore.Address.isValid(
      this.address, this.network);
//    const cashAddress = this.bitcoreCash.Address.isValid(
//      this.address, this.network);
    const safeAddress = this.bitcoreSafe.Address.isValid(
      this.address, this.network);
    const btczAddress = this.bitcoreBtcz.Address.isValid(
      this.address, this.network);
    const zclAddress = this.bitcoreZcl.Address.isValid(
      this.address, this.network);
    const anonAddress = this.bitcoreAnon.Address.isValid(
      this.address, this.network);
    const zelAddress = this.bitcoreZel.Address.isValid(
      this.address, this.network);
    const zenAddress = this.bitcoreZen.Address.isValid(
      this.address, this.network);
    const rvnAddress = this.bitcoreRvn.Address.isValid(
      this.address, this.network);
    const ltcAddress = this.bitcoreLtc.Address.isValid(
      this.address, this.network);
    if (this.coinname == 'Bitcoin Cash (BCH)' /* && cashAddress*/ ){
      this.coin = 'bch';
    } else  if (this.coinname == 'Safecoin (SAFE)' && safeAddress ){
      this.coin = 'safe';
    } else  if (this.coinname == 'BitcoinZ (BTCZ)' && btczAddress){
      this.coin = 'btcz';
    } else  if (this.coinname == 'Zelcash (ZEL)' &&  zelAddress){
      this.coin = 'zel';
    } else  if (this.coinname == 'Horizen (ZEN)' &&  zenAddress){
      this.coin = 'zen';
    } else  if (this.coinname == 'Zclassic (ZCL)' && zclAddress){
      this.coin = 'zcl';
    } else  if (this.coinname == 'Anonymous (ANON)' && anonAddress){
      this.coin = 'anon';
    } else  if (this.coinname == 'Ravencoin (RVN)' && rvnAddress){
      this.coin = 'rvn';
    } else  if (this.coinname == 'Litecoin (LTC)' && ltcAddress){
      this.coin = 'ltc';
    } else  if (this.coinname == 'Bitcoin (BTC)' && btcAddress){
      this.coin = 'btc';
    }
  }


  ionViewDidLoad() {}

  public sendTo(): void {
    this.navCtrl.push(AmountPage, {
      toAddress: this.address,
      name: this.name,
      email: this.email,
      coin: this.coin,
      recipientType: 'contact',
      network: this.network
    });
  }

  public remove(addr: string, network: string): void {
    var title = this.translate.instant('Warning!');
    var message = this.translate.instant(
      'Are you sure you want to delete this contact?'
    );
    this.popupProvider.ionicConfirm(title, message, null, null).then(res => {
      if (!res) return;
      this.addressBookProvider
        .remove(addr, network)
        .then(() => {
          this.navCtrl.pop();
        })
        .catch(err => {
          this.popupProvider.ionicAlert(this.translate.instant('Error'), err);
          return;
        });
    });
  }
}
