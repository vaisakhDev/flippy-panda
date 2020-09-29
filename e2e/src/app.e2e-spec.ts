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
    expect(page.getDeckNames()).toEqual(['🗃 deck #1'])
    page.navigateTo()
    expect(page.getDeckFromPicklistBtns().count()).toBe(1)
    expect(page.getDeckNames()).toEqual(['🗃 deck #1'])
  })

  it('🎴 should add a Card', () => {
    page.getLeftInputFromDeckPage().sendKeys('text on the left')
    page.getRightInputFromDeckPage().sendKeys('text on the right')
    page.getAddCardBtn().click()
    expect(page.getMatRows().count()).toBe(1)
    expect(page.getTextFromMatCells()).toEqual([
      '🎴',
      'text on the left',
      'text on the right',
      '',
    ])
    page.navigateTo()
    expect(page.getMatRows().count()).toBe(1)
    expect(page.getTextFromMatCells()).toEqual([
      '🎴',
      'text on the left',
      'text on the right',
      '',
    ])
  })

  it('🎴 should add a second Card', () => {
    page.getLeftInputFromDeckPage().sendKeys('second text on the left')
    page.getRightInputFromDeckPage().sendKeys('second text on the right')
    page.getAddCardBtn().click()
    expect(page.getMatRows().count()).toBe(2)
    expect(page.getTextFromMatCells()).toEqual([
      '🎴',
      'text on the left',
      'text on the right',
      '',
      '🎴',
      'second text on the left',
      'second text on the right',
      '',
    ])
  })

  it('🎴 should remove a Card', () => {
    page.getRemoveCardBtn().get(1).click()
    expect(page.getMatRows().count()).toBe(1)
    page.navigateTo()
    expect(page.getMatRows().count()).toBe(1)
  })

  it('🗃 should add a second Deck', () => {
    page.getAddDeckBtn().click()
    expect(page.getDeckFromPicklistBtns().count()).toBe(2)
    expect(page.getDeckNames()).toEqual(['🗃 deck #1', '🗃 deck #2'])
    page.navigateTo()
    expect(page.getDeckFromPicklistBtns().count()).toBe(2)
    expect(page.getDeckNames()).toEqual(['🗃 deck #1', '🗃 deck #2'])
  })

  it('🗃 should rename the second Deck', () => {
    page.getRenameDeckBtn().click()
    page.getNewNameInput().sendKeys('2\n')
    expect(page.getDeckNames()).toEqual(['🗃 deck #1', '🗃 deck #22'])
    page.navigateTo()
    expect(page.getDeckNames()).toEqual(['🗃 deck #1', '🗃 deck #22'])
  })

  it('🎴 should add a Card to the second Deck', () => {
    page.getLeftInputFromDeckPage().sendKeys('text on the left')
    page.getRightInputFromDeckPage().sendKeys('text on the right')
    page.getAddCardBtn().click()
    expect(page.getMatRows().count()).toBe(1)
    expect(page.getTextFromMatCells()).toEqual([
      '🎴',
      'text on the left',
      'text on the right',
      '',
    ])
    page.navigateTo()
    expect(page.getMatRows().count()).toBe(1)
    expect(page.getTextFromMatCells()).toEqual([
      '🎴',
      'text on the left',
      'text on the right',
      '',
    ])
  })

  it('🎴 should switch back to the first Deck', () => {
    page.getDeckFromPicklistBtns().get(0).click()
    expect(page.getActiveDeckTitle()).toEqual('🗃 deck #1')
    page.navigateTo()
    expect(page.getActiveDeckTitle()).toEqual('🗃 deck #1')
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
