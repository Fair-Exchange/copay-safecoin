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
import { isEqual } from 'lodash';

// providers
import { AddressBookProvider } from '../../../../providers/address-book/address-book';
import { AddressProvider } from '../../../../providers/address/address';
import { BwcProvider } from '../../../../providers/bwc/bwc';
import { Logger } from '../../../../providers/logger/logger';

// validators
import { AddressValidator } from '../../../../validators/address';
import { ScanPage } from '../../../scan/scan';

@Component({
  selector: 'page-addressbook-add',
  templateUrl: 'add.html'
})
export class AddressbookAddPage {
  private addressBookAdd: FormGroup;

  public submitAttempt: boolean = false;
  public isCordova: boolean;
  private last_addr: string = '';
  private plug: string = ''; 
  private COINS_LIST: string[] = [
    'Safecoin (SAFE)',
    'BitcoinZ (BTCZ)',
    'Zelcash (ZEL)',
    'Anonymous (ANON)',
    'Zclassic (ZCL)',
    'Ravencoin (RVN)',
    'Litecoin (LTC)',
    'Bitcoin (BTC)',
    'Bitcoin Cash (BCH)'
  ];
  public coinslist: string[];
  public okText: string;
  public cancelText: string;
//  private selectedcoin: string;
//  private CoinsList: string[];
  private bitcore;
  private bitcoreCash;
  private bitcoreSafe;
  private bitcoreBtcz;
  private bitcoreLtc;
  private bitcoreZel;
  private bitcoreZcl;
  private bitcoreAnon;
  private bitcoreRvn;
 
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
    private logger: Logger
  ) {                                                                                                                                                				
      this.bitcore = this.bwcProvider.getBitcore();
      this.bitcoreCash = this.bwcProvider.getBitcoreCash();
      this.bitcoreSafe = this.bwcProvider.getBitcoreSafe();
      this.bitcoreBtcz = this.bwcProvider.getBitcoreBtcz();
      this.bitcoreZel = this.bwcProvider.getBitcoreZel();
      this.bitcoreZcl = this.bwcProvider.getBitcoreZcl();
      this.bitcoreAnon = this.bwcProvider.getBitcoreAnon();
      this.bitcoreRvn = this.bwcProvider.getBitcoreRvn();
      this.bitcoreLtc = this.bwcProvider.getBitcoreLtc();
      this.coinslist = this.COINS_LIST;
      this.okText = this.translate.instant('Ok');
      this.cancelText = this.translate.instant('Cancel');
      this.addressBookAdd = this.formBuilder.group({
      name: [
        '',
        Validators.compose([Validators.minLength(1), Validators.required])
      ],
      email: ['', this.emailOrEmpty],
      address: [
        '',
        Validators.compose([
          Validators.required,
          new AddressValidator(this.addressProvider).isValid
        ])
      ],
      note: [''],
      network: [''],
      coin: ['', Validators.required]
/*      coin: [
        null,
        Validators.compose([
          Validators.required,
          new AddressValidator(this.addressProvider).getCoin
        ])
      ]*/
    });
    if (this.plug) this.plug = ' ';
    this.addressBookAdd.controls['coin'].setValue('');
    this.coinSet('defaultlist');
    if (this.navParams.data.addressbookEntry) {
      this.addressBookAdd.controls['address'].setValue(
        this.navParams.data.addressbookEntry
      );
    }
    this.events.subscribe('update:address', data => {
      let address = data.value.replace(/^bitcoin(cash)?:|safecoin:|bitcoinz:|zelcash:|zclassic:|anonymous:|revencoin:|litecoin:/, '');
      this.addressBookAdd.controls['address'].setValue(address);
    });
  }
  ngOnInit() {
     this.addressBookAdd.get('name').setValidators([Validators.required]);
    }

  private setCoins(address: string): void {
    let CoinsList:string[] = new Array();
//    if (this.coinslist != this.last_coins ) {
      let tmp_i: number = -1;
      try {
        new this.bitcoreSafe.Address(address);
        tmp_i++; CoinsList[tmp_i] = this.COINS_LIST[0];
      } catch (e) { this.plug = ' ';}
      try {
        new this.bitcoreBtcz.Address(address);
        tmp_i++; CoinsList[tmp_i] = this.COINS_LIST[1];
      } catch (e) { this.plug = ' ';}
      try {
        new this.bitcoreZel.Address(address);
        tmp_i++; CoinsList[tmp_i] = this.COINS_LIST[2];
      } catch (e) { this.plug = ' ';}
      try {
        new this.bitcoreAnon.Address(address);
        tmp_i++; CoinsList[tmp_i] = this.COINS_LIST[3];
      } catch (e) { this.plug = ' ';}
      try {
        new this.bitcoreZcl.Address(address);
        tmp_i++; CoinsList[tmp_i] = this.COINS_LIST[4];
      } catch (e) { this.plug = ' ';}
      try {
        new this.bitcoreRvn.Address(address);
        tmp_i++; CoinsList[tmp_i] = this.COINS_LIST[5];
      } catch (e) { this.plug = ' ';}
      try {
        new this.bitcoreLtc.Address(address);
        tmp_i++; CoinsList[tmp_i] = this.COINS_LIST[6];
      } catch (e) { this.plug = ' ';}
      try {
        new this.bitcore.Address(address);
        tmp_i++; CoinsList[tmp_i] = this.COINS_LIST[7];
      } catch (e) { this.plug = ' ';}
      try {
        new this.bitcoreCash.Address(address);
        tmp_i++; CoinsList[tmp_i] = this.COINS_LIST[8];
      } catch (e) { this.plug = ' ';}
     if (tmp_i >= 0 && !(isEqual(this.coinslist, CoinsList))) {
       this.coinslist = new Array(tmp_i + 1); 
       for (var iii = 0; iii <= tmp_i; iii++) {
         this.coinslist[iii] = CoinsList[iii];
       }
       this.addressBookAdd.controls['coin'].setValue(this.coinslist[0]);
//       this.last_coin = this.addressBookAdd.controls['coin'].value;
     }
//     if (this.last_coin != this.addressBookAdd.controls['coin'].value) this.last_coin = this.addressBookAdd.controls['coin'].value;
//   }
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
    this.coinslist = this.COINS_LIST;
    this.addressBookAdd.controls['coin'].setValue('');
  } else if (address && address == '' && this.last_addr != '') {
    this.last_addr = '';
    this.coinslist = this.COINS_LIST;
    this.addressBookAdd.controls['coin'].setValue('');
  } else if (address && address != 'defaultlist' && address != 'set' && address != '' && 
             address != this.last_addr && this.addressBookAdd.controls.address.status == 'VALID') {




    this.setCoins(address);
    this.last_addr = address;
    this.addressBookAdd.controls['coin'].setValue(this.addressBookAdd.controls['coin'].value);
  } else if (address && address != 'defaultlist' && address != 'set' && 
             this.addressBookAdd.controls.address.status == 'VALID'){
    this.last_addr = address;
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
