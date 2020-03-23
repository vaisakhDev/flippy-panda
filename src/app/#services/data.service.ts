import { Injectable } from '@angular/core'
import { Guid } from 'guid-typescript'
import { PersistentData, Stack, Card } from '../interfaces'
import { CardSide } from '../enums'
import { Observable } from 'rxjs'
import { User, Realm } from '../interfaces'

type Item = Stack | Card

@Injectable({
  providedIn: 'root',
})
export class DataService {
  persistentData: PersistentData = {
    realms: [],
    activeRealmId: undefined,
    activeStackId: undefined,
    banner: true,
  }
  chosenCardSide = CardSide.top
  user$: Observable<User>

  constructor() {
    let lStorage = JSON.parse(localStorage.getItem('flippyPanda'))
    if (lStorage) {
      // migrates to newer format
      if (lStorage.stacks) {
        const realmId = Guid.create().toString()
        lStorage = {
          realms: [
            {
              id: realmId,
              name: 'Realm #1',
              stacks: lStorage.stacks,
            },
          ],
          activeRealmId: realmId,
          activeStackId: lStorage.activeStackId,
          banner: lStorage.banner,
        }
      }
      this.persistentData = lStorage
    } else {
      const realmId = Guid.create().toString()
      this.persistentData = {
        ...lStorage,
        realms: [
          {
            id: realmId,
            name: 'Realm #1',
            stacks: [],
          },
        ],
        activeRealmId: realmId,
        banner: true,
      }
    }
  }

  addStack(realm: Realm = this.getActiveRealm()): {
    newStack: Stack,
    newStacks: Stack[],
  } {
    const stacks: Stack[] = realm.stacks
    const newId = this.createUniqueId()
    const newStack = {
      id: newId,
      name: `stack #${stacks.length + 1}`,
      cards: [],
    }

    const newStacks = [...stacks, newStack]
      .sort((a: Stack, b: Stack) => a.name > b.name ? 1 : -1)

    const otherRealms = this.persistentData.realms.filter(actRealm => actRealm !== realm)

    this.updatePersistentData({
      realms: [
        ...otherRealms,
        {
          ...realm,
          stacks: newStacks,
        },
      ],
      activeStackId: newId,
    })

    return { newStack, newStacks }
  }

  removeStack(realm: Realm = this.getActiveRealm(), stackId: string = this.persistentData.activeStackId): Stack[] {
    const stacks: Stack[] = realm.stacks
    const leftStacks = stacks.filter(e => e.id !== stackId)
    const removedStackIndex = stacks.map((stack, index) => ({ ...stack, index }))
      .filter(stack => stack.id === stackId)[0].index

    const otherRealms = this.persistentData.realms.filter(actRealm => actRealm !== realm)

    const updatedRealms = [
      ...otherRealms,
      {
        ...realm,
        stacks: leftStacks,
      },
    ]

    if (stacks.length === 1) {
      this.updatePersistentData({
        realms: updatedRealms,
        activeStackId: undefined,
      })
    } else if (stacks.length > 1 && removedStackIndex === 0) {
      this.updatePersistentData({
        realms: updatedRealms,
        activeStackId: stacks[removedStackIndex + 1].id,
      })
    } else {
      this.updatePersistentData({
        realms: updatedRealms,
        activeStackId: stacks[removedStackIndex - 1].id,
      })
    }
    return leftStacks
  }

  addCard(leftText: string, rightText: string) {
    this.updateActiveStack({
      cards: [...this.getActiveStack().cards, {
        id: this.createUniqueId(),
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
    this.persistentData = Object.assign(this.persistentData, update)
    this.updateLocalStorage()
  }

  updateActiveStack(update: object, updateLocalStorage = true) {
    Object.assign(this.getActiveStack(), update)
    if (updateLocalStorage) {
      this.updateLocalStorage()
    }
  }

  updateLocalStorage = () => localStorage.setItem('flippyPanda', JSON.stringify(this.persistentData))

  getActiveRealm(id: string = this.persistentData.activeRealmId, persistentData: PersistentData = this.persistentData): Realm {
    if (persistentData.realms.length > 0) {
      return persistentData.realms.filter(realm => realm.id === id)[0]
    } else {
      return {
        id: undefined,
        name: undefined,
        stacks: [],
      }
    }
  }

  getActiveStack(id: string = this.persistentData.activeStackId, persistentData: PersistentData = this.persistentData): Stack {
    const activeRealm: Realm = this.getActiveRealm()

    if (activeRealm.stacks.length > 0) {
      return activeRealm.stacks.filter(stack => stack.id === id)[0]
    } else {
      return {
        id: undefined,
        name: undefined,
        cards: [],
      }
    }
  }

  createUniqueId = (): string => Guid.create().toString()
}
