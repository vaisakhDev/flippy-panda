export interface PersistentData {
  readonly realms: Realm[],
  readonly activeRealmId: string,
  readonly activeStackId: string,
  readonly banner: boolean,
}
export interface Realm {
  readonly id: string,
  readonly name: string,
  readonly stacks: Stack[],
}
export interface Stack {
  readonly id: string,
  readonly name: string,
  readonly cards: Card[],
}
export interface Card {
  readonly id: string,
  readonly left: string,
  readonly right: string,
}
export interface User {
  readonly uid: string
  readonly email: string
  readonly displayName?: string,
}
