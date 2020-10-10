export interface Data {
  readonly realms: Realm[]
  readonly activeRealmId: string
}
export interface Realm {
  readonly id: string
  readonly name: string
  readonly decks: Deck[]
  readonly activeDeckId: string
}
export interface Deck {
  readonly id: string
  readonly name: string
  readonly cards: Card[]
}
export interface Card {
  readonly id: string
  readonly left: string
  readonly right: string
}
export interface User {
  readonly uid: string
  readonly email: string
  readonly displayName?: string
}
