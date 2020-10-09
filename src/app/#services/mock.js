export const dataWithNoRealms = {
  realms: [],
  activeRealmId: undefined,
  banner: false,
}

export const dataWithOneRealm = {
  realms: [{ id: 'id', name: 'name', decks: [], activeDeckId: undefined }],
  activeRealmId: 'id',
  banner: false,
}

export const dataWithNoCards = {
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

export const dataWithOneCard = {
  realms: [
    {
      id: 'id',
      name: 'name',
      decks: [
        {
          id: 'id',
          name: 'name',
          cards: [
            {
              id: 'id',
              left: 'left',
              right: 'right',
            },
          ],
        },
      ],
      activeDeckId: 'id',
    },
  ],
  activeRealmId: 'id',
  banner: false,
}
