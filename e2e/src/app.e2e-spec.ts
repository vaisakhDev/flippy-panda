import { AppPage } from './app.po'
import { browser, logging } from 'protractor'

describe('workspace-project App', () => {
  let page: AppPage

  beforeEach(() => {
    page = new AppPage()
  })

  it('🤗 should display welcome message', () => {
    page.navigateTo()
    expect(page.getTitleText()).toEqual(
      `Create a Realm 🪐\nThen a Deck 🗃\nThen Cards 🎴🎴🎴`
    )
  })

  it('💾 should show LocalStorage info', () => {
    expect(page.getLocalStorageInfoText()).toEqual(
      `This app uses Local Storage to persist data 💾\nOkay that's fine 😊`
    )
  })

  it('💾 should close LocalStorage info', () => {
    expect(page.getLocalStorageInfo().isPresent()).toBe(true)
    page.getCloseLocalStorageInfoBtn().click()
    expect(page.getLocalStorageInfo().isPresent()).toBe(false)
    page.navigateTo()
    expect(page.getLocalStorageInfo().isPresent()).toBe(false)
  })

  it('🪐 should add a Realm', () => {
    page.getAddRealmBtn().click()
    page.getRealmSelectionInitiatorBtn().click()
    expect(page.getRealmFromPicklistBtns().count()).toBe(1)
    page.navigateTo()
    page.getRealmSelectionInitiatorBtn().click()
    expect(page.getRealmFromPicklistBtns().count()).toBe(1)
  })

  it('🗃  should add a Deck', () => {
    page.navigateTo()
    page.getAddDeckBtn().click()
    expect(page.getDeckFromPicklistBtns().count()).toBe(1)
    page.navigateTo()
    expect(page.getDeckFromPicklistBtns().count()).toBe(1)
  })

  it('🎴 should add a Card', () => {
    page.getLeftInputFromDeckPage().sendKeys('text on the top-side (left)')
    page.getRightInputFromDeckPage().sendKeys('text on the bottom-side (right)')
    page.getAddCardBtn().click()
    expect(page.getMatRows().count()).toBe(1)
    expect(page.getTextFromMatCells()).toEqual([
      '🎴',
      'text on the top-side (left)',
      'text on the bottom-side (right)',
      '',
    ])
    page.navigateTo()
    expect(page.getMatRows().count()).toBe(1)
    expect(page.getTextFromMatCells()).toEqual([
      '🎴',
      'text on the top-side (left)',
      'text on the bottom-side (right)',
      '',
    ])
  })

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER)
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    )
  })
})
