Copay-safecoin is a secure bitcoin wallet platform for both desktop and mobile devices. Copay uses [Bitcore Wallet Service](https://github.com/fair-exchange/bitcore-wallet-service-safecoin) (BWS) for peer synchronization and network interfacing.

For a list of frequently asked questions please visit the [Copay FAQ](https://github.com/bitpay/copay/wiki/COPAY---FAQ).

## Main Features

- Multiple wallet creation and management in-app
- Intuitive, multisignature security for personal or shared wallets
- Easy spending proposal flow for shared wallets and group payments
- [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) Hierarchical deterministic (HD) address generation and wallet backups
- Device-based security: all private keys are stored locally, not in the cloud
- Support for Bitcoin testnet wallets
- Synchronous access across all major mobile and desktop platforms
- Payment protocol (BIP70-BIP73) support: easily-identifiable payment requests and verifiable, secure bitcoin payments
- Support for over 150 currency pricing options and unit denomination in BTC or bits
- Mnemonic (BIP39) support for wallet backups
- Paper wallet sweep support (BIP38)
- Email notifications for payments and transfers
- Push notifications (only available for ios and android versions)
- Customizable wallet naming and background colors
- Multiple languages supported
- Available for [iOS](https://itunes.apple.com/us/app/copay/id951330296), [Android](https://play.google.com/store/apps/details?id=com.bitpay.copay&hl=en), [Windows Phone](http://www.windowsphone.com/en-us/store/app/copay-wallet/4372479b-a064-4d18-8bd3-74a3bdb81c3a), [Chrome App](https://chrome.google.com/webstore/detail/copay/cnidaodnidkbaplmghlelgikaiejfhja?hl=en), [Linux](https://github.com/bitpay/copay/releases/latest), [Windows](https://github.com/bitpay/copay/releases/latest) and [OS X](https://github.com/bitpay/copay/releases/latest) devices

## Testing in a Browser

> **Note:** This method should only be used for development purposes. When running Copay in a normal browser environment, browser extensions and other malicious code might have access to internal data and private keys. For production use, see the latest official [releases](https://github.com/bitpay/copay/releases/).

Clone the repo and open the directory:

```sh
git clone https://github.com/fair-exchange/copay-saqfecoin.git
cd copay-safecoin
```

Ensure you have [Node](https://nodejs.org/) installed, then install and start Copay:

```sh
npm install
npm run apply:copay
npm run start
```

Visit [`localhost:8100`](http://localhost:8100/) to view the app.

## Unit & E2E Tests (Karma & Protractor)

To run the tests, run:

```
 npm run test
```

## Testing on Real Devices

It's recommended that all final testing be done on a real device – both to assess performance and to enable features that are unavailable to the emulator (e.g. a device camera).

### Android

Follow the [Cordova Android Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/) to set up your development environment.

When your developement enviroment is ready, run the `start:android` package script.

```sh
npm run apply:copay
npm run prepare:copay
npm run start:android
```

### iOS

Follow the [Cordova iOS Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/) to set up your development environment.

When your developement enviroment is ready, run the `start:ios` package script.

```sh
npm run apply:copay
npm run prepare:copay
npm run start:ios
```

<!-- ### Desktop (Linux, macOS, and Windows)

The desktop version of Copay currently uses NW.js, an app runtime based on Chromium. To get started, first install NW.js on your system from [the NW.js website](https://nwjs.io/).

When NW.js is installed, run the `start:desktop` package script.

```sh
npm run apply:copay
npm run start:desktop
``` -->

## Build Copay App Bundles

Before building the release version for a platform, run the `clean-all` command to delete any untracked files in your current working directory. (Be sure to stash any uncommited changes you've made.) This guarantees consistency across builds for the current state of this repository.

The `final` commands build the production version of the app, and bundle it with the release version of the platform being built.

### Android

```sh
npm run clean-all
npm run apply:copay
npm run prepare:copay
npm run final:android
```

### iOS

```sh
npm run clean-all
npm run apply:copay
npm run prepare:copay
npm run final:ios
```

<!-- ### Desktop (Linux, macOS, and Windows)

```sh
npm run clean-all
npm run apply:copay
npm run final:desktop
``` -->

## License

Copay is released under the MIT License. Please refer to the [LICENSE](https://github.com/bitpay/copay/blob/master/LICENSE) file that accompanies this project for more information including complete terms and conditions.
