export interface PersistentData {
  readonly stacks: Stack[],
  readonly activeStackId: string,
  readonly banner: boolean,
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
