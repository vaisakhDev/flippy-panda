import { Injectable } from '@angular/core'
import hri from 'human-readable-ids'
import { PersistentData, Stack, Card } from '../interfaces'
import { CardSide } from '../enums'
import { Observable } from 'rxjs'
import { User } from '../interfaces'

type Item = Stack | Card

@Injectable({
  providedIn: 'root',
})
export class DataService {
  persistentData: PersistentData = {
    stacks: [],
    activeStackId: undefined,
    banner: true,
  }
  activeStack: Stack = {
    id: undefined,
    name: undefined,
    cards: [],
  }
  activeStackBase = JSON.parse(JSON.stringify(this.activeStack))
  chosenCardSide = CardSide.top
  user$: Observable<User>

  constructor() {
    const lStorage = JSON.parse(localStorage.getItem('flippyPanda'))
    if (lStorage) {
      this.persistentData = lStorage
      this.SetActiveStackId(lStorage.activeStackId)
    }
  }

  addStack(stacks: Stack[] = this.persistentData.stacks): {
    newStack: Stack,
    newStacks: Stack[],
  } {
    const newId = this.createUniqueId(stacks)
    const newStack = {
      id: newId,
      name: `stack #${stacks.length + 1}`,
      cards: [],
    }

    const newStacks = [...stacks, newStack]
      .sort((a: Stack, b: Stack) => a.name > b.name ? 1 : -1)

    this.updatePersistentData({ stacks: newStacks })
    this.SetActiveStackId(newId)

    return { newStack, newStacks }
  }

  removeStack(stacks: Stack[] = this.persistentData.stacks, id: string = this.persistentData.activeStackId): Stack[] {
    const leftStacks = stacks.filter(e => e.id !== id)
    this.updatePersistentData({ stacks: [...leftStacks] }, false)
    if (stacks.length > 0) {
      this.SetActiveStackId(stacks[0].id)
    } else {
      this.SetActiveStackId(undefined)
    }
    return leftStacks
  }

  addCard(leftText: string, rightText: string) {
    this.updateActiveStack({
      cards: [...this.activeStack.cards, {
        id: this.createUniqueId(this.activeStack.cards),
        left: leftText,
        right: rightText,
      }],
    })
  }

  removeCard(id: string) {
    const activeStack = this.activeStack
    const leftCards = activeStack.cards.filter(e => e.id !== id)
    this.updateActiveStack({ cards: [...leftCards] })
  }

  updatePersistentData(update: object, updateLocalStorage = true) {
    Object.assign(this.persistentData, update)
    if (updateLocalStorage) {
      this.updateLocalStorage()
    }
  }

  updateActiveStack(update: object, updateLocalStorage = true) {
    Object.assign(this.activeStack, update)
    if (updateLocalStorage) {
      this.updateLocalStorage()
    }
  }

  updateLocalStorage = () => localStorage.setItem('flippyPanda', JSON.stringify(this.persistentData))

  SetActiveStackId(id: string) {
    this.updatePersistentData({ activeStackId: id })
    this.activeStack = id
      ? this.persistentData.stacks.filter(e => e.id === this.persistentData.activeStackId)[0]
      : this.activeStackBase
  }

  createUniqueId = (arr: Item[]): string => {
    let newId: string
    while (true) {
      newId = hri.hri.random()
      const leftStacks = arr.filter(e => e.id === newId)
      if (leftStacks.length === 0) { return newId }
    }
  }
}
