export interface PersistentData {
  stacks: Stack[],
  activeStackId: string,
  banner: boolean,
}
export interface Stack {
  id: string,
  name: string,
  cards: Card[],
}
export interface Card {
  id: string,
  left: string,
  right: string,
}
export interface User {
  uid: string
  email: string
  photoURL?: string,
  displayName?: string,
}
