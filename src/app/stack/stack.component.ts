import { Component, OnInit, ViewChild } from '@angular/core'
import { MatTable } from '@angular/material'
import { StackService } from '../stack.service'
import { MatInput } from '@angular/material/input'
import { MatDialog } from '@angular/material/dialog'

let renameDialogRef

@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.scss']
})
export class StackComponent {
  displayedColumns: string[] = ['cardIcon', 'left', 'right', 'remove']
  newName: string
  mainState

  @ViewChild(MatTable, { static: true }) table: MatTable<any>
  @ViewChild('topside', { static: true }) topSideInput: MatInput

  constructor(public service: StackService, public dialog: MatDialog) {
    this.mainState = service.mainState
  }

  openRunDialog = () => {
    if (this.service.activeStack.cards.length > 0) {
      this.dialog.open(RunDialogComponent)
    }
  }

  addCard(event) {
    event.preventDefault()

    const textareas = document.querySelectorAll('input')
    const leftText: string = textareas[0].value
    const rightText: string = textareas[1].value

    this.service.addCard(leftText, rightText)
    this.table.renderRows()
    textareas.forEach(e => e.value = '')
    this.topSideInput.focus()
  }

  openRenameStackDialog = () => {
    renameDialogRef = this.dialog.open(RenameDialogComponent)
    renameDialogRef.afterClosed().subscribe(() => {
      this.service.updateLocalStorage()
    })
  }

  removeStack = () => this.service.removeStack()

  removeCard = (obj) => this.service.removeCard(obj.id)
}

@Component({
  templateUrl: './run-dialog.html',
})
export class RunDialogComponent {
  data
  actCard
  actWord
  actWordLeft
  actWordRight
  leftActive
  finished = false

  positives = 0
  negatives = 0

  constructor(public service: StackService) {
    this.data = JSON.parse(JSON.stringify(this.service.activeStack.cards))
    this.data = this.shuffleArray(this.data)
    this.actCard = this.data.pop()
    this.actWordLeft = this.actCard.left
    this.actWordRight = this.actCard.right
    this.leftActive = true
    this.actWord = this.actWordLeft
  }

  shuffleArray = (arr) => {
    return arr
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1])
  }

  flip = () => {
    this.leftActive = !this.leftActive
    this.actWord = this.leftActive ? this.actWordLeft : this.actWordRight
  }

  nextCard = (trueAnswer) => {
    if (trueAnswer) {
      this.positives++
    } else {
      this.negatives++
    }
    this.leftActive = true
    if (this.data.length) {
      this.actCard = this.data.pop()
      this.actWordLeft = this.actCard.left
      this.actWordRight = this.actCard.right
      this.actWord = this.actWordLeft
    } else {
      this.finished = true
    }
  }
}

@Component({
  templateUrl: 'rename-dialog.html',
})
export class RenameDialogComponent {

  constructor(public service: StackService) { }

  renameStack(event) {
    event.preventDefault()
    const newName = (document.getElementById('newNameInput') as HTMLInputElement).value
    this.service.activeStack.name = newName
    renameDialogRef.close([])
  }
}
