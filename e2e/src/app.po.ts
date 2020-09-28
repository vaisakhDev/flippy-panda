import { browser, by, element } from 'protractor'

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>
  }

  getTitleText() {
    return element(by.css('#welcomeMsg')).getText() as Promise<string>
  }

  // ----------
  // buttons
  // ----------

  getAddRealmBtn() {
    return element(by.css('#addRealmBtn'))
  }

  getRealmSelectionInitiatorBtn() {
    return element(by.css('#realmSelectionInitiatorBtn'))
  }

  getRealmFromPicklistBtns() {
    return element.all(by.css('.realmFromPicklistBtn'))
  }

  getAddDeckBtn() {
    return element(by.css('#addDeckBtn'))
  }

  getDeckFromPicklistBtns() {
    return element.all(by.css('.deckFromPicklistBtn'))
  }
}
