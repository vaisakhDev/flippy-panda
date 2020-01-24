import { Injectable } from '@angular/core'
import hri from 'human-readable-ids'
import { PersistentData, Stack, Card } from './interfaces'
import { CardSide } from './enums'

type Item = Stack | Card

@Injectable({
  providedIn: 'root'
})
export class StackService {
  persistentData: PersistentData = {
    stacks: [],
    activeStackId: undefined,
    banner: true
  }
  activeStack: Stack = {
    id: undefined,
    name: undefined,
    cards: []
  }
  activeStackBase = JSON.parse(JSON.stringify(this.activeStack))
  chosenCardSide = CardSide.top

  constructor() {
    const state = JSON.parse(localStorage.getItem('flippyPanda'))
    if (state) {
      this.persistentData = state
      this.updateActiveStack(state.activeStackId)
    }
  }

  save(newObj: object, updateLocalStorage: boolean = true) {
    Object.assign(this.persistentData, newObj)
    if (updateLocalStorage) {
      localStorage.setItem('flippyPanda', JSON.stringify(this.persistentData))
    }
  }

  addStack() {
    const newId = this.createUniqueId(this.persistentData.stacks)
    const newStack = {
      id: newId,
      name: `stack #${this.persistentData.stacks.length + 1}`,
      cards: []
    }

    this.save({ stacks: [...this.persistentData.stacks, newStack] })
    this.updateActiveStack(newId)
  }

  removeStack() {
    const leftStacks = this.persistentData.stacks.filter(e => {
      return e.id !== this.persistentData.activeStackId
    })
    this.save({ stacks: [...leftStacks] }, false)
    if (this.persistentData.stacks.length > 0) {
      this.updateActiveStack(this.persistentData.stacks[0].id)
    } else {
      this.updateActiveStack(undefined)
    }
    this.updateLocalStorage()
  }

  addCard(leftText: string, rightText: string) {
    this.activeStack.cards.push({
      id: this.createUniqueId(this.activeStack.cards),
      left: leftText,
      right: rightText
    })
    this.updateLocalStorage()
  }

  removeCard(id: string) {
    const activeStack = this.activeStack
    const leftCards = activeStack.cards.filter(e => e.id !== id)
    activeStack.cards = leftCards
    this.updateLocalStorage()
  }

  updateLocalStorage() {
    localStorage.setItem('flippyPanda', JSON.stringify(this.persistentData))
  }

  updateActiveStack(id: string) {
    this.save({ activeStackId: id })
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
