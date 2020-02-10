import { Component } from '@angular/core'
import { Card } from '../interfaces'
import { CardSide } from '../enums'
import { DataService } from '../data.service'
import gsap from 'gsap'

@Component({
  templateUrl: './run-dialog.component.html',
  styleUrls: ['./run-dialog.component.scss'],
})
export class RunDialogComponent {
  data: Card[]
  actCard: Card
  actWord: string
  actWordLeft: string
  actWordRight: string
  cardSide = CardSide.top
  finished = false

  positives = 0
  negatives = 0

  constructor(public dataService: DataService) {
    this.data = JSON.parse(JSON.stringify(this.dataService.activeStack.cards))
    this.data = this.shuffleArray(this.data)
    this.actCard = this.data.pop()
    this.actWordLeft = this.actCard.left
    this.actWordRight = this.actCard.right

    if (this.dataService.chosenCardSide === CardSide.top) {
      this.cardSide = CardSide.top
      this.actWord = this.actWordLeft
    } else {
      this.cardSide = CardSide.bottom
      this.actWord = this.actWordRight
    }
  }

  shuffleArray = (arr: Card[]): Card[] => {
    return arr
      .map(a => [Math.random(), a])
      .sort((a, b) => +a[0] - +b[0])
      .map(a => a[1]) as Card[]
  }

  flip = () => {
    gsap.from('#question', { rotationY: -180 })
    switch (this.cardSide) {
      case CardSide.top:
        this.cardSide = CardSide.bottom
        this.actWord = this.actWordRight
        break
      case CardSide.bottom:
        this.cardSide = CardSide.top
        this.actWord = this.actWordLeft
    }
  }

  nextCard = (trueAnswer: boolean) => {
    if (trueAnswer) {
      this.positives++
    } else {
      this.negatives++
    }
    if (this.dataService.chosenCardSide === CardSide.top) {
      this.cardSide = CardSide.top
    } else {
      this.cardSide = CardSide.bottom
    }
    if (this.data.length) {
      this.actCard = this.data.pop()
      this.actWordLeft = this.actCard.left
      this.actWordRight = this.actCard.right
      if (this.dataService.chosenCardSide === CardSide.top) {
        this.actWord = this.actWordLeft
      } else {
        this.actWord = this.actWordRight
      }
    } else {
      this.finished = true
    }
  }
}
