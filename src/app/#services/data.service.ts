import { Injectable } from '@angular/core'
import { Guid } from 'guid-typescript'
import { PersistentData, Deck, Card } from '../interfaces'
import { CardSide } from '../enums'
import { Observable } from 'rxjs'
import { User, Realm } from '../interfaces'

type Item = Deck | Card

@Injectable({
  providedIn: 'root',
})
export class DataService {
  persistentData: PersistentData = {
    realms: [],
    activeRealmId: undefined,
    activeDeckId: undefined,
    banner: true,
  }
  chosenCardSide = CardSide.top
  user$: Observable<User>

  constructor() {
    let lStorage = JSON.parse(localStorage.getItem('flippyPanda'))
    if (lStorage) {
      // migrates to newer format
      if (lStorage.decks) {
        const realmId = this.createUniqueId()
        lStorage = {
          realms: [
            {
              id: realmId,
              name: 'Realm #1',
              stacks: lStorage.stacks,
            },
          ],
          activeRealmId: realmId,
          activeStackId: lStorage.activeStackId,
          banner: lStorage.banner,
        }
      }
      if (lStorage.activeStackId) {
        lStorage = {
          realms: [
            {
              id: lStorage.realms[0].id,
              name: lStorage.realms[0].name,
              decks: lStorage.realms[0].stacks,
            },
          ],
          activeRealmId: lStorage.activeRealmId,
          activeDeckId: lStorage.activeStackId,
          banner: lStorage.banner,
        }
      }
      this.persistentData = lStorage
    } else {
      const realmId = this.createUniqueId()
      this.persistentData = {
        ...lStorage,
        realms: [
          {
            id: realmId,
            name: 'Realm #1',
            decks: [],
          },
        ],
        activeRealmId: realmId,
        banner: true,
      }
    }
  }

  updatePersistentData(update: object) {
    this.persistentData = Object.assign(this.persistentData, update)
    this.updateLocalStorage()
  }

  updateLocalStorage = () => localStorage.setItem('flippyPanda', JSON.stringify(this.persistentData))

  getActiveRealm(id: string = this.persistentData.activeRealmId, persistentData: PersistentData = this.persistentData): Realm {
    if (persistentData.realms.length > 0) {
      return persistentData.realms.filter(realm => realm.id === id)[0]
    } else {
      return {
        id: undefined,
        name: undefined,
        decks: [],
      }
    }
  }

  addDeck(realm: Realm = this.getActiveRealm()): {
    newDeck: Deck,
    newDecks: Deck[],
  } {
    const decks: Deck[] = realm.decks
    const newId = this.createUniqueId()
    const newDeck = {
      id: newId,
      name: `deck #${decks.length + 1}`,
      cards: [],
    }

    const newDecks = [...decks, newDeck]
      .sort((a: Deck, b: Deck) => a.name > b.name ? 1 : -1)

    const otherRealms = this.persistentData.realms.filter(actRealm => actRealm !== realm)

    this.updatePersistentData({
      realms: [
        ...otherRealms,
        {
          ...realm,
          decks: newDecks,
        },
      ],
      activeDeckId: newId,
    })

    return { newDeck, newDecks }
  }

  getActiveDeck(id: string = this.persistentData.activeDeckId, persistentData: PersistentData = this.persistentData): Deck {
    const activeRealm: Realm = this.getActiveRealm()

    if (activeRealm.decks.length > 0) {
      return activeRealm.decks.filter(deck => deck.id === id)[0]
    } else {
      return {
        id: undefined,
        name: undefined,
        cards: [],
      }
    }
  }

  updateActiveDeck(update: object, updateLocalStorage = true) {
    Object.assign(this.getActiveDeck(), update)
    if (updateLocalStorage) {
      this.updateLocalStorage()
    }
  }

  removeDeck(realm: Realm = this.getActiveRealm(), deckId: string = this.persistentData.activeDeckId): Deck[] {
    const decks: Deck[] = realm.decks
    const leftDecks = decks.filter(e => e.id !== deckId)
    const removedDeckIndex = decks.map((deck, index) => ({ ...deck, index }))
      .filter(deck => deck.id === deckId)[0].index

    const otherRealms = this.persistentData.realms.filter(actRealm => actRealm !== realm)

    const updatedRealms = [
      ...otherRealms,
      {
        ...realm,
        decks: leftDecks,
      },
    ]

    if (decks.length === 1) {
      this.updatePersistentData({
        realms: updatedRealms,
        activeDeckId: undefined,
      })
    } else if (decks.length > 1 && removedDeckIndex === 0) {
      this.updatePersistentData({
        realms: updatedRealms,
        activeDeckId: decks[removedDeckIndex + 1].id,
      })
    } else {
      this.updatePersistentData({
        realms: updatedRealms,
        activeDeckId: decks[removedDeckIndex - 1].id,
      })
    }
    return leftDecks
  }

  addCard(leftText: string, rightText: string) {
    this.updateActiveDeck({
      cards: [...this.getActiveDeck().cards, {
        id: this.createUniqueId(),
        left: leftText,
        right: rightText,
      }],
    })
  }

  removeCard(id: string) {
    const activeDeck = this.getActiveDeck()
    const leftCards = activeDeck.cards.filter(e => e.id !== id)
    this.updateActiveDeck({ cards: [...leftCards] })
  }

  createUniqueId = (): string => Guid.create().toString()
}
