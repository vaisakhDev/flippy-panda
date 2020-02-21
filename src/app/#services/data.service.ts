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
  chosenCardSide = CardSide.top
  user$: Observable<User>

  constructor() {
    const lStorage = JSON.parse(localStorage.getItem('flippyPanda'))
    if (lStorage) {
      this.persistentData = lStorage
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

    this.updatePersistentData({ stacks: newStacks, activeStackId: newId })

    return { newStack, newStacks }
  }

  removeStack(stacks: Stack[] = this.persistentData.stacks, id: string = this.persistentData.activeStackId): Stack[] {
    const leftStacks = stacks.filter(e => e.id !== id)
    const removedStackIndex = stacks.map((stack, index) => ({ ...stack, index }))
      .filter(stack => stack.id === id)[0].index

    if (stacks.length === 1) {
      this.updatePersistentData({
        stacks: [...leftStacks],
        activeStackId: undefined,
      })
    } else if (stacks.length > 1 && removedStackIndex === 0) {
      this.updatePersistentData({
        stacks: [...leftStacks],
        activeStackId: stacks[removedStackIndex + 1].id,
      })
    } else {
      this.updatePersistentData({
        stacks: [...leftStacks],
        activeStackId: stacks[removedStackIndex - 1].id,
      })
    }
    return leftStacks
  }

  addCard(leftText: string, rightText: string) {
    this.updateActiveStack({
      cards: [...this.getActiveStack().cards, {
        id: this.createUniqueId(this.getActiveStack().cards),
        left: leftText,
        right: rightText,
      }],
    })
  }

  removeCard(id: string) {
    const activeStack = this.getActiveStack()
    const leftCards = activeStack.cards.filter(e => e.id !== id)
    this.updateActiveStack({ cards: [...leftCards] })
  }

  updatePersistentData(update: object) {
    Object.assign(this.persistentData, update)
    this.updateLocalStorage()
  }

  updateActiveStack(update: object, updateLocalStorage = true) {
    Object.assign(this.getActiveStack(), update)
    if (updateLocalStorage) {
      this.updateLocalStorage()
    }
  }

  updateLocalStorage = () => localStorage.setItem('flippyPanda', JSON.stringify(this.persistentData))

  createUniqueId = (arr: Item[]): string => {
    let newId: string
    while (true) {
      newId = hri.hri.random()
      const leftStacks = arr.filter(e => e.id === newId)
      if (leftStacks.length === 0) { return newId }
    }
  }

  getActiveStack(id: string = this.persistentData.activeStackId, persistentData: PersistentData = this.persistentData): Stack {
    if (persistentData.stacks.length > 0) {
      return persistentData.stacks.filter(stack => stack.id === id)[0]
    } else {
      return {
        id: undefined,
        name: undefined,
        cards: [],
      }
    }
  }
}
