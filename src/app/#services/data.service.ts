import { Injectable } from '@angular/core'
import { Guid } from 'guid-typescript'
import { Data, Deck, Card } from '../interfaces'
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

  setData(data: Data) {
    this.data = Object.assign(this.data, data)
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
        ...data.realms,
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
    this.setData({ ...this.getData(), activeRealmId })
  }

  getRealm = (id: String, data: Data = this.data): Realm =>
    data.realms.filter((realm) => realm.id === id)[0]

  getRealms = (): Realm[] => this.data.realms

  // ----------
  // DECKS 🗃
  // ----------

  addDeck(data: Data = this.getData()): [newDeck: Deck, newDecks: Deck[]] {
    const actRealm: Realm = this.getActiveRealm(data)
    const decks: Deck[] = actRealm.decks
    const id = this.createUniqueId()

    const newDeck = {
      id: id,
      name: `🗃 deck #${decks.length + 1}`,
      cards: [],
    }
    const newDecks = [...decks, newDeck].sort((a: Deck, b: Deck) =>
      a.name > b.name ? 1 : -1
    )

    this.setData({
      ...data,
      realms: data.realms.map((realm) => {
        if (realm.id === actRealm.id) {
          return {
            ...realm,
            decks: newDecks,
            activeDeckId: id,
          }
        } else return realm
      }),
    })

    return [newDeck, newDecks]
  }

  updateActiveDeck(update: Deck, data: Data = this.getData()) {
    Object.assign(this.getActiveDeck(data), update)
    localStorage.setItem(LS_ITEM_NAME, JSON.stringify(data))
  }

  removeDeck(
    id: string = this.getActiveDeck(this.getData()).id,
    data: Data = this.getData()
  ): Deck[] {
    const activeRealm: Realm = this.getActiveRealm(data)
    const realms: Realm[] = data.realms

    if (!activeRealm.decks.length) return []

    const decks = activeRealm.decks
    const activeDeckIdx = decks.findIndex((deck) => deck.id === id)
    const leftDecks = decks.filter((deck) => deck.id !== id)

    this.setData({
      ...data,
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
      ...this.getData(),
      realms: realms.map((realm) => {
        if (realm.id === activeRealm.id) {
          return { ...realm, activeDeckId: targetDeckId }
        } else return { ...realm }
      }),
    })
  }

  getDecks(data: Data = this.getData()) {
    return this.getActiveRealm(data).decks
  }

  getDeck = (id: String, data: Data = this.getData()): Deck =>
    data.realms
      .map((realm) => realm.decks.filter((deck) => deck.id === id))
      .map((arr) => (arr.length > 0 ? arr[0] : null))
      .filter(Boolean)[0]

  getActiveDeck = (data: Data = this.getData()): Deck =>
    this.getDeck(this.getActiveRealm(data).activeDeckId, data)

  // ----------
  // CARDS 🎴
  // ----------

  addCard(
    leftText: string,
    rightText: string,
    data: Data = this.getData()
  ): Card {
    const card = {
      id: this.createUniqueId(),
      left: leftText,
      right: rightText,
    }

    this.setData({
      ...data,
      realms: data.realms.map((realm) => {
        if (realm.id === this.getActiveRealm(data).id) {
          return {
            ...realm,
            decks: realm.decks.map((deck) => {
              if (deck.id === this.getActiveDeck(data).id) {
                return { ...deck, cards: [...deck.cards, card] }
              } else return deck
            }),
          }
        } else return realm
      }),
    })

    return card
  }

  removeCard(id: string, data: Data = this.getData()): Card[] {
    const activeRealm = this.getActiveRealm(data)
    const activeDeck = this.getActiveDeck(data)
    const leftCards = activeDeck.cards.filter((e) => e.id !== id)

    this.setData({
      ...data,
      realms: data.realms.map((realm) => {
        if (realm.id === activeRealm.id) {
          return {
            ...realm,
            decks: realm.decks.map((deck) => {
              if (deck.id === activeDeck.id) {
                return { ...deck, cards: leftCards }
              } else return deck
            }),
          }
        } else return realm
      }),
    })

    return leftCards
  }
}
