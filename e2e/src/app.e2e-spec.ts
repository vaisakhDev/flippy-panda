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

  it('🪐 should add a Realm', () => {
    page.navigateTo()
    page.getAddRealmBtn().click()
    page.getRealmSelectionInitiatorBtn().click()
    expect(page.getRealmFromPicklistBtns().count()).toBe(1)
  })

  it('🗃  should add a Deck', () => {
    page.navigateTo()
    page.getAddDeckBtn().click()
    expect(page.getDeckFromPicklistBtns().count()).toBe(1)
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
