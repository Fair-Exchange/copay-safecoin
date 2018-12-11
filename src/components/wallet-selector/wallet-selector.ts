import { Component } from '@angular/core';
import { ActionSheetParent } from '../action-sheet/action-sheet-parent';

@Component({
  selector: 'wallet-selector',
  templateUrl: 'wallet-selector.html'
})
export class WalletSelectorComponent extends ActionSheetParent {
  public wallets;
  public walletsAll;
  public walletsBtc;
  public walletsBch;
  public walletsSafe;
  public walletsBtcz;
  public walletsZcl;
  public walletsAnon;
  public walletsZel;
  public walletsZen;
  public walletsRvn;
  public walletsLtc;
  public title: string;
  public selectedWalletId: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.wallets = this.params.wallets;
    this.title = this.params.title;
    this.selectedWalletId = this.params.selectedWalletId;
    this.separateWallets();
  }

  private separateWallets(): void {
    this.walletsAll = this.wallets;
    this.walletsBtc = this.wallets.filter(wallet => wallet.coin === 'btc');
    this.walletsBch = this.wallets.filter(wallet => wallet.coin === 'bch');
    this.walletsSafe = this.wallets.filter(wallet => wallet.coin === 'safe');
    this.walletsBtcz = this.wallets.filter(wallet => wallet.coin === 'btcz');
    this.walletsZcl = this.wallets.filter(wallet => wallet.coin === 'zcl');
    this.walletsAnon = this.wallets.filter(wallet => wallet.coin === 'anon');
    this.walletsZel = this.wallets.filter(wallet => wallet.coin === 'zel');
    this.walletsZen = this.wallets.filter(wallet => wallet.coin === 'zen');
    this.walletsRvn = this.wallets.filter(wallet => wallet.coin === 'rvn');
    this.walletsLtc = this.wallets.filter(wallet => wallet.coin === 'ltc');
  }

  public optionClicked(option): void {
    this.dismiss(option);
  }
}
