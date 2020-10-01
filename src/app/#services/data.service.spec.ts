import { TestBed, inject } from '@angular/core/testing'

import { DataService } from './data.service'

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService],
    })
  })

  it('🪐 should add a Realm', inject([DataService], (service: DataService) => {
    let [realm, realms] = service.addRealm({
      realms: [],
      activeRealmId: undefined,
      banner: false,
    })
    expect(realm).toEqual({
      id: realm.id,
      name: `🪐 Realm #1`,
      decks: [],
      activeDeckId: undefined,
    })
    expect(realms).toEqual([
      {
        id: realm.id,
        name: `🪐 Realm #1`,
        decks: [],
        activeDeckId: undefined,
      },
    ])
  }))
})
