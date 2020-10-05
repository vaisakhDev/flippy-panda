import { Injectable } from '@angular/core'
import { Guid } from 'guid-typescript'
import { Data, Deck } from '../interfaces'
import { CardSide } from '../enums'
import { Observable } from 'rxjs'
import { User, Realm } from '../interfaces'

const LS_ITEM_NAME = 'flippyPanda' // name of the localStorage item

@Injectable({
  providedIn: 'root',
})
export class DataService {
  data: Data = {
    realms: [],
    activeRealmId: undefined,
    banner: true,
  }
  chosenCardSide = CardSide.top
  user$: Observable<User>

  constructor() {
    const lStorage = JSON.parse(localStorage.getItem('flippyPanda'))
    if (lStorage) {
      this.data = lStorage
    } else {
      const realmId = this.createUniqueId()
      this.data = {
        ...lStorage,
        realms: [],
        activeRealmId: realmId,
        banner: true,
      }
    }
  }

  createUniqueId = (): string => Guid.create().toString()

  getData = () => this.data

  setData(update: object) {
    this.data = Object.assign(this.data, update)
    localStorage.setItem(LS_ITEM_NAME, JSON.stringify(this.getData()))
  }

  // ----------
  // REALMS 🌌
  // ----------

  /**
   * Adds a new realm and returns it, together with a new list of realms.
   *
   * @param data - A Data object as template
   * @returns The new realm and a updated list of realms
   */
  addRealm(data: Data = this.data): [Realm, Realm[]] {
    const realmId = this.createUniqueId()
    this.setData({
      ...data,
      realms: [
        ...this.data.realms,
        {
          id: realmId,
          name: `🌌 Realm #${data.realms.length + 1}`,
          decks: [],
          activeDeckId: undefined,
        },
      ],
      activeRealmId: realmId,
    })
    return [this.getRealm(realmId), this.getRealms()]
  }

  // todo: implement
  renameRealm() {}

  /**
   * Removes a realm and returns the other realms.
   *
   * @param realm - The realm which should be removed
   * @param realms - The list from which the realm should be removed
   * @returns A new list of realms without the passed realm
   */
  removeRealm(
    id: String = this.getActiveRealm().id,
    data: Data = this.data
  ): Realm[] {
    const leftRealms = data.realms.filter((realm) => realm.id !== id)
    const realmsCnt = leftRealms.length
    this.setData({
      ...data,
      realms: leftRealms,
      activeRealmId: realmsCnt > 0 ? leftRealms[realmsCnt - 1].id : null,
    })
    return this.getData().realms
  }

  getActiveRealm(data: Data = this.getData()): Realm {
    const id: string = data.activeRealmId
    if (data.realms.length > 0) {
      return data.realms.filter((realm) => realm.id === id)[0]
    } else {
      return {
        id: undefined,
        name: undefined,
        decks: [],
        activeDeckId: undefined,
      }
    }
  }

  changeRealm(activeRealmId: string) {
    this.setData({ activeRealmId })
  }

  getRealm = (id: String, data: Data = this.data): Realm =>
    data.realms.filter((realm) => realm.id === id)[0]

  getRealms = (): Realm[] => this.data.realms

  // ----------
  // DECKS 🗃
  // ----------

  addDeck(
    realm: Realm = this.getActiveRealm()
  ): {
    newDeck: Deck
    newDecks: Deck[]
  } {
    const decks: Deck[] = realm.decks
    const newId = this.createUniqueId()
    const newDeck = {
      id: newId,
      name: `🗃 deck #${decks.length + 1}`,
      cards: [],
    }

    const newDecks = [...decks, newDeck].sort((a: Deck, b: Deck) =>
      a.name > b.name ? 1 : -1
    )

    const otherRealms = this.data.realms.filter(
      (actRealm) => actRealm !== realm
    )

    this.setData({
      realms: [
        ...otherRealms,
        {
          ...realm,
          decks: newDecks,
          activeDeckId: newId,
        },
      ],
    })

    return { newDeck, newDecks }
  }

  updateActiveDeck(update: object, updateLocalStorage = true) {
    Object.assign(this.getActiveDeck(), update)
    if (updateLocalStorage) {
      localStorage.setItem(LS_ITEM_NAME, JSON.stringify(this.getData()))
    }
  }

  removeDeck(
    activeRealm: Realm = this.getActiveRealm(),
    realms: Realm[] = this.data.realms
  ): Deck[] {
    if (!activeRealm.decks.length) return []

    const activeDeckId = activeRealm.activeDeckId
    const decks = activeRealm.decks
    const activeDeckIdx = decks.findIndex((deck) => deck.id === activeDeckId)
    const leftDecks = decks.filter((deck) => deck.id !== activeDeckId)

    this.setData({
      realms: realms.map((realm) => {
        if (realm.id === activeRealm.id) {
          if (decks.length === 1) {
            return {
              ...realm,
              decks: leftDecks,
              activeDeckId: undefined,
            }
          } else if (decks.length === activeDeckIdx + 1) {
            return {
              ...realm,
              decks: leftDecks,
              activeDeckId: decks[activeDeckIdx - 1].id,
            }
          } else {
            return {
              ...realm,
              decks: leftDecks,
              activeDeckId: decks[activeDeckIdx + 1].id,
            }
          }
        } else return realm
      }),
    })
    return leftDecks
  }

  /**
   * Removes a realm and returns the other realms.
   *
   * @param targetDeckId - The ID from the Deck you want to switch to
   * @param realms - The ID from the Deck you want to switch to
   * @returns A new list of realms without the passed realm
   */
  changeActiveDeck = (
    targetDeckId: string,
    realms: Realm[] = this.data.realms,
    activeRealm: Realm = this.getActiveRealm()
  ) => {
    this.setData({
      realms: realms.map((realm) => {
        if (realm.id === activeRealm.id) {
          return { ...realm, activeDeckId: targetDeckId }
        } else return { ...realm }
      }),
    })
  }

  getDeck = (id: String): Deck =>
    this.data.realms
      .map((realm) => realm.decks.filter((deck) => deck.id === id))
      .map((arr) => (arr.length > 0 ? arr[0] : null))
      .filter(Boolean)[0]

  getActiveDeck = (): Deck => this.getDeck(this.getActiveRealm().activeDeckId)

  // ----------
  // CARDS 🎴
  // ----------

  addCard(leftText: string, rightText: string) {
    this.updateActiveDeck({
      cards: [
        ...this.getActiveDeck().cards,
        {
          id: this.createUniqueId(),
          left: leftText,
          right: rightText,
        },
      ],
    })
  }

  removeCard(id: string) {
    const activeDeck = this.getActiveDeck()
    const leftCards = activeDeck.cards.filter((e) => e.id !== id)
    this.updateActiveDeck({ cards: [...leftCards] })
  }
}
