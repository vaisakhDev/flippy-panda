import { TestBed, inject } from '@angular/core/testing'
import { DataService } from './data.service'
import { Realm, Deck, Card } from '../interfaces'

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService],
    })
  })

  const data_1 = {
    realms: [],
    activeRealmId: undefined,
    banner: false,
  }

  const data_2 = {
    realms: [{ id: 'id', name: 'name', decks: [], activeDeckId: undefined }],
    activeRealmId: undefined,
    banner: false,
  }

  const data_3 = {
    realms: [{ id: 'id', name: 'name', decks: [], activeDeckId: undefined }],
    activeRealmId: 'id',
    banner: false,
  }

  const data_4 = {
    realms: [
      {
        id: 'id',
        name: 'name',
        decks: [{ id: 'id', name: 'name', cards: [] }],
        activeDeckId: 'id',
      },
    ],
    activeRealmId: 'id',
    banner: false,
  }

  it('🌌 should add a Realm', inject([DataService], (service: DataService) => {
    let [realm, realms]: [Realm, Realm[]] = service.addRealm(data_1)
    expect(realm).toEqual({
      id: realm.id,
      name: `🌌 Realm #1`,
      decks: [],
      activeDeckId: undefined,
    })
    expect(realms).toEqual([
      {
        id: realm.id,
        name: `🌌 Realm #1`,
        decks: [],
        activeDeckId: undefined,
      },
    ])
  }))

  it('🌌 should remove a Realm', inject(
    [DataService],
    (service: DataService) => {
      let realms: Realm[] = service.removeRealm('id', data_2)
      expect(realms).toEqual([])
    }
  ))

  it('🌌 should get a Realm', inject([DataService], (service: DataService) => {
    let realm: Realm = service.getRealm('id', data_2)
    expect(realm.id).toEqual('id')
  }))

  it('🌌 should get active Realm', inject(
    [DataService],
    (service: DataService) => {
      let realm: Realm = service.getActiveRealm(data_3)
      expect(realm.id).toEqual('id')
    }
  ))

  it('🗃 should add a Deck', inject([DataService], (service: DataService) => {
    let [newDeck, decks]: [Deck, Deck[]] = service.addDeck(data_3)
    expect(newDeck).toEqual({
      id: newDeck.id,
      name: `🗃 deck #1`,
      cards: [],
    })
    expect(decks).toEqual([
      {
        id: newDeck.id,
        name: `🗃 deck #1`,
        cards: [],
      },
    ])
    expect(service.getData()).toEqual({
      realms: [
        { id: 'id', name: 'name', decks: [newDeck], activeDeckId: newDeck.id },
      ],
      activeRealmId: 'id',
      banner: false,
    })
    expect(service.getData()).toEqual({
      realms: [{ id: 'id', name: 'name', decks, activeDeckId: newDeck.id }],
      activeRealmId: 'id',
      banner: false,
    })
  }))

  it('🗃 should get a Deck', inject([DataService], (service: DataService) => {
    let deck: Deck = service.getDeck('id', data_4)
    expect(deck).toEqual({ id: 'id', name: 'name', cards: [] })
  }))

  it('🗃 should get active Deck', inject(
    [DataService],
    (service: DataService) => {
      let deck: Deck = service.getActiveDeck(data_4)
      expect(deck).toEqual({ id: 'id', name: 'name', cards: [] })
    }
  ))

  it('🗃 should remove a Deck', inject([DataService], (service: DataService) => {
    let leftDecks: Deck[] = service.removeDeck('id', data_4)
    expect(leftDecks.length).toEqual(0)
  }))

  it('🎴 should add a Card', inject([DataService], (service: DataService) => {
    const card: Card = service.addCard('left', 'right', data_4)
    expect(card).toEqual({
      id: card.id,
      left: 'left',
      right: 'right',
    })
    expect(service.getData().realms[0].decks[0].cards[0]).toEqual({
      id: card.id,
      left: 'left',
      right: 'right',
    })
  }))
})
