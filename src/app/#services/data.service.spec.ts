import { TestBed, inject } from '@angular/core/testing'
import { DataService } from './data.service'
import { Realm } from '../interfaces'

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
})
