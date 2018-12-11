import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { AddressBookProvider } from '../../../providers/address-book/address-book';
import { Logger } from '../../../providers/logger/logger';
import { AddressbookAddPage } from './add/add';
import { AddressbookViewPage } from './view/view';

import { Coin_Spec } from '../../../providers/wallet/wallet';

@Component({
  selector: 'page-addressbook',
  templateUrl: 'addressbook.html'
})
export class AddressbookPage {
  private cache: boolean = false;
  private Coins = Coin_Spec;
  public addressbook: object[] = [];
  public filteredAddressbook: object[] = [];

  public isEmptyList: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private logger: Logger,
    private addressbookProvider: AddressBookProvider
  ) {
    this.initAddressbook();
}

  ionViewDidEnter() {
    if (this.cache) this.initAddressbook();
    this.cache = true;
    this.Coins = Coin_Spec;
  }
  
  private initAddressbook(): void {
    this.addressbookProvider
      .list()
      .then(addressBook => {
        this.isEmptyList = _.isEmpty(addressBook);

        let contacts: object[] = [];
        _.each(addressBook, (contact, k: string) => {
          contacts.push({
            name: _.isObject(contact) ? contact.name : contact,
            address: k,
            coin: _.isObject(contact) ? this.Coins[this.Coins.indexOf(this.Coins.filter(function foo(item) {return item[0] == contact.coin})[0])][2] : '???',
            email: _.isObject(contact) ? contact.email : null,
            note: _.isObject(contact) ? contact.note : null,
            network: _.isObject(contact) ? contact.network : null
          });
        });
        this.addressbook = _.clone(contacts);
        this.filteredAddressbook = _.clone(this.addressbook);
      })
      .catch(err => {
        this.logger.error(err);
        let alertError = this.alertCtrl.create({
          title: err,
          buttons: [
            {
              text: 'Go back',
              handler: () => {
                this.navCtrl.pop();
              }
            }
          ]
        });
        alertError.present();
      });
  }

  public addEntry(): void {
    this.navCtrl.push(AddressbookAddPage);
  }

  public viewEntry(contact): void {
    this.navCtrl.push(AddressbookViewPage, { contact });
  }

  public getItems(event): void {
    // set val to the value of the searchbar
    let val = event.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      let result = _.filter(this.addressbook, item => {
        let name = item['name'];
        return _.includes(name.toLowerCase(), val.toLowerCase());
      });
      this.filteredAddressbook = result;
    } else {
      // Reset items back to all of the items
      this.initAddressbook();
    }
  }
}
