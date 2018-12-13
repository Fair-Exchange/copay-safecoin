import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  AlertController,
  Events,
  NavController,
  NavParams
} from 'ionic-angular';

// import { isEqual } from 'lodash';

// providers
import { AddressBookProvider } from '../../../../providers/address-book/address-book';
import { AddressProvider } from '../../../../providers/address/address';
import { BwcProvider } from '../../../../providers/bwc/bwc';
import { Logger } from '../../../../providers/logger/logger';

// validators
import { AddressValidator } from '../../../../validators/address';
import { ScanPage } from '../../../scan/scan';

import { Coin_Spec } from '../../../../providers/wallet/wallet';

@Component({
  selector: 'page-addressbook-add',
  templateUrl: 'add.html'
})
export class AddressbookAddPage {
  private addressBookAdd: FormGroup;

  public submitAttempt: boolean = false;
  public isCordova: boolean;
  private last_addr: string = '';
  private CoinsDisabled: string[] = new Array();
  public CoinsOptions: any = {}; // value: string[] = new Array(), disabled: boolean[] = new Array()};
  public okText: string;
  public cancelText: string;
  private Bitcore;
//  private bitcore;
//  private bitcoreCash;
//  private bitcoreSafe;
//  private bitcoreBtcz;
//  private bitcoreLtc;
//  private bitcoreZel;
//  private bitcoreZcl;
//  private bitcoreAnon;
//  private bitcoreRvn;
  private Coins = Coin_Spec;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private events: Events,
    private alertCtrl: AlertController,
    private ab: AddressBookProvider,
    private addressProvider: AddressProvider,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private bwcProvider: BwcProvider,
    private logger: Logger) {                                                                                                                                                				
    this.Bitcore = {
      safe: this.bwcProvider.getBitcoreSafe(),
      btcz: this.bwcProvider.getBitcoreBtcz(),
      zel:  this.bwcProvider.getBitcoreZel(),
      zen:  this.bwcProvider.getBitcoreZen(),
      anon: this.bwcProvider.getBitcoreAnon(),
      zcl:  this.bwcProvider.getBitcoreZcl(),
      rito:  this.bwcProvider.getBitcoreRito(),
      rvn:  this.bwcProvider.getBitcoreRvn(),
      ltc:  this.bwcProvider.getBitcoreLtc(),
      btc:  this.bwcProvider.getBitcore()
//      bch:  this.bwcProvider.getBitcoreCash()
    };

//    this.bitcore = this.bwcProvider.getBitcore();
//    this.bitcoreCash = this.bwcProvider.getBitcoreCash();
//    this.bitcoreSafe = this.bwcProvider.getBitcoreSafe();
//    var ggg = "btcz";
//    this.bitcoreBtcz = this.Bitcore[ggg];
//    this.bitcoreBtcz = this.bwcProvider.getBitcoreBtcz();
//    this.bitcoreZel = this.bwcProvider.getBitcoreZel();
//    this.bitcoreZcl = this.bwcProvider.getBitcoreZcl();
//    this.bitcoreAnon = this.bwcProvider.getBitcoreAnon();
//    this.bitcoreRvn = this.bwcProvider.getBitcoreRvn();
//    this.bitcoreLtc = this.bwcProvider.getBitcoreLtc();

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

    this.CoinsDisabled = this.CoinsOptions.disabled;
    this.okText = this.translate.instant('Ok');
    this.cancelText = this.translate.instant('Cancel');

    this.addressBookAdd = this.formBuilder.group({
      name: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      email: ['', this.emailOrEmpty],
      address: ['', Validators.compose([Validators.required, new AddressValidator(this.addressProvider).isValid])],
      note: [''],
      network: [''],
      coin: ['']
    });
    this.addressBookAdd.controls['coin'].setValue('');
    this.coinSet('defaultlist');
    if (this.navParams.data.addressbookEntry) {
      this.addressBookAdd.controls['address'].setValue(this.navParams.data.addressbookEntry);
    }
    this.events.subscribe('update:address', data => {
      let address = data.value.replace(/^bitcoin(cash)?:|safecoin:|bitcoinz:|zelcash:|zen:|zclassic:|ritocoin:|anonymous:|revencoin:|litecoin:/, '');
      this.addressBookAdd.controls['address'].setValue(address);
    });
  }
  ngOnInit() {
     this.addressBookAdd.get('name').setValidators([Validators.required]);
  }

  private setCoins(address: string): void {

    let tmp_i: number = -1;
    let first_enabled: number = -1;
    for (var tmp_coin = 0; tmp_coin < this.Coins.length; tmp_coin++) {
      if (this.Coins[tmp_coin][1] == "1") {
	  try {
            new this.Bitcore[this.Coins[tmp_coin][0]].Address(address);
            tmp_i++; this.CoinsOptions.disabled[tmp_i] = "false";
            if (first_enabled < 0) first_enabled = tmp_i;
          } catch (e) { 
            tmp_i++; this.CoinsOptions.disabled[tmp_i] = "true";
          }
      } 
    }
    if (first_enabled < 0) first_enabled = 0;
    if (this.addressBookAdd.controls['coin'].value != '' && tmp_i >= 0) {
      if ( this.CoinsOptions.value.indexOf(this.addressBookAdd.controls['coin'].value) >= 0 &&
           this.CoinsOptions.disabled[this.CoinsOptions.value.indexOf(this.addressBookAdd.controls['coin'].value)] == "true" ) {
        this.addressBookAdd.controls['coin'].setValue(this.CoinsOptions.value[first_enabled]);
      }
    } else if (tmp_i >= 0){
      this.addressBookAdd.controls['coin'].setValue(this.CoinsOptions.value[first_enabled]);
    }
  }

  ionViewDidLoad() {
    this.logger.info('ionViewDidLoad AddressbookAddPage');
  }

  ngOnDestroy() {
    this.events.unsubscribe('update:address');
  }

  private emailOrEmpty(control: AbstractControl): ValidationErrors | null {
    return control.value === '' ? null : Validators.email(control);
  }

  private coinSet(address: string): boolean {
  if (address && address == 'defaultlist' && this.last_addr != '') {
    this.last_addr = '';
    this.CoinsOptions.disabled = this.CoinsDisabled;
    this.addressBookAdd.controls['coin'].setValue('');
  } else if (address && address == '' && this.last_addr != '') {
    this.last_addr = '';
    this.CoinsOptions.disabled = this.CoinsDisabled;
    this.addressBookAdd.controls['coin'].setValue('');
  } else if (address && address != 'defaultlist' && address != 'set' && address != '' && 
             address != this.last_addr && this.addressBookAdd.controls.address.status == 'VALID') {
    this.setCoins(address);
    this.last_addr = address;
    this.addressBookAdd.controls['coin'].setValue(this.addressBookAdd.controls['coin'].value);
  } else if (address && address != 'defaultlist' && address != 'set' && 
             this.addressBookAdd.controls.address.status == 'VALID'){
    this.last_addr = address;
  } else if (address && address != 'defaultlist' && address != 'set' && 
             this.addressBookAdd.controls.address.status == 'INVALID'){
    this.CoinsOptions.disabled = this.CoinsDisabled;
    this.addressBookAdd.controls['coin'].setValue('');
  } else if (address == 'set'){
    this.addressBookAdd.controls['coin'].setValue(this.addressBookAdd.controls['coin'].value);
  }
    return true;
  }

  public save(): void {

  this.submitAttempt = true;
    if (this.addressBookAdd.valid) {
      this.ab
        .add(this.addressBookAdd.value)
        .then(() => {
          this.navCtrl.pop();
          this.submitAttempt = false;
        })
        .catch(err => {
          let opts = {
            title: err,
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.navCtrl.pop();
                }
              }
            ]
          };
          this.alertCtrl.create(opts).present();
          this.submitAttempt = false;
        });
    } else {
      let opts = {
        title: 'Error',
        message: 'Could not save the contact',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.navCtrl.pop();
            }
          }
        ]
      };
      this.alertCtrl.create(opts).present();
      this.submitAttempt = false;
    }
  }

  public openScanner(): void {
    this.navCtrl.push(ScanPage, { fromAddressbook: true });
  }

}
