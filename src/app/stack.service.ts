import { Injectable } from '@angular/core'
import hri from 'human-readable-ids'

@Injectable({
  providedIn: 'root'
})
export class StackService {
  mainState = { // deals with local storage
    stacks: [
      // {
      //   id: 'a',
      //   name: 'stack #1',
      //   cards: [
      //     { id: 'abc123', left: '1+1', right: '2' }, ...
      //   ]
      // }, ...
    ],
    activeStackId: undefined,
    banner: true
  }
  activeStack = {
    id: undefined,
    name: undefined,
    cards: []
  }
  activeStackBase = JSON.parse(JSON.stringify(this.activeStack))
  choseTopSideToStart = true

  constructor() {
    const state = JSON.parse(localStorage.getItem('flippyPanda'))
    if (state) {
      this.mainState = state
      this.updateActiveStack(state.activeStackId)
    }
  }

  addStack() {
    const newId = this.createUniqueId(this.mainState.stacks)
    const newStack = {
      id: newId,
      name: `stack #${this.mainState.stacks.length + 1}`,
      cards: []
    }

    this.mainState.stacks.push(newStack)
    this.updateActiveStack(newId)
    this.updateLocalStorage()
  }

  removeStack() {
    const leftStacks = this.mainState.stacks.filter(e => {
      return e.id !== this.mainState.activeStackId
    })
    this.mainState.stacks = leftStacks
    if (this.mainState.stacks.length > 0) {
      this.updateActiveStack(this.mainState.stacks[0].id)
    } else {
      this.updateActiveStack(undefined)
    }
    this.updateLocalStorage()
  }

  addCard(leftText, rightText) {
    this.activeStack.cards.push({
      id: this.createUniqueId(this.activeStack.cards),
      left: leftText,
      right: rightText
    })
    this.updateLocalStorage()
  }

  removeCard(id) {
    const activeStack = this.activeStack
    const leftCards = activeStack.cards.filter(e => e.id !== id)
    activeStack.cards = leftCards
    this.updateLocalStorage()
  }

  updateLocalStorage() {
    localStorage.setItem('flippyPanda', JSON.stringify(this.mainState))
  }

  updateActiveStack(id) {
    this.mainState.activeStackId = id
    this.activeStack = id
      ? this.mainState.stacks.filter(e => e.id === this.mainState.activeStackId)[0]
      : this.activeStackBase
  }

  createUniqueId = (arr) => {
    let newId
    while (true) {
      newId = hri.hri.random()
      const leftStacks = arr.filter(e => e.id === newId)
      if (leftStacks.length === 0) { return newId }
    }
  }
}
