import { Injectable } from '@angular/core'
import hri from 'human-readable-ids'

@Injectable({
  providedIn: 'root'
})
export class StackService {
  persistentData = { // deals with local storage
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
      this.persistentData = state
      this.updateActiveStack(state.activeStackId)
    }
  }

  save(newObj) {
    Object.assign(this.persistentData, newObj)
    localStorage.setItem('flippyPanda', JSON.stringify(this.persistentData))
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
    this.save({ stacks: [...leftStacks] })
    if (this.persistentData.stacks.length > 0) {
      this.updateActiveStack(this.persistentData.stacks[0].id)
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
    localStorage.setItem('flippyPanda', JSON.stringify(this.persistentData))
  }

  updateActiveStack(id) {
    this.save({ activeStackId: id })
    this.activeStack = id
      ? this.persistentData.stacks.filter(e => e.id === this.persistentData.activeStackId)[0]
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
