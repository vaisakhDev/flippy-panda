import { Component, ViewChild } from '@angular/core'
import { MatTable } from '@angular/material'
import { DataService } from '../data.service'
import { MatInput } from '@angular/material/input'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { PersistentData, Card, Stack } from '../interfaces'
import { CardSide } from '../enums'
import { RunDialogComponent } from '../run-dialog/run-dialog.component'

let renameDialogRef: MatDialogRef<RenameDialogComponent, any>

@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.scss'],
})
export class StackComponent {
  displayedColumns: string[] = ['cardIcon', 'left', 'right', 'remove']
  newName: string
  persistentData: PersistentData

  @ViewChild(MatTable, { static: true }) table: MatTable<any>
  @ViewChild('topside', { static: true }) topSideInput: MatInput

  constructor(public dataService: DataService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.persistentData = dataService.persistentData
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 2000 })
  }

  openPlayOrderDialog = () => {
    if (this.dataService.activeStack.cards.length > 0) {
      this.dialog.open(PlayOrderComponent)
    }
  }

  addCard(event: Event) {
    event.preventDefault()

    const textareas = document.querySelectorAll('input')
    const leftText: string = textareas[0].value
    const rightText: string = textareas[1].value

    this.dataService.addCard(leftText, rightText)
    this.table.renderRows()
    textareas.forEach(e => e.value = '')
    this.topSideInput.focus()
    this.openSnackBar(`🎴Card("${leftText}", "${rightText}")`, 'Added 📥')
  }

  openRenameStackDialog = () => renameDialogRef = this.dialog.open(RenameDialogComponent)

  removeStack = () => this.dataService.removeStack()

  removeCard = (card: Card) => this.dataService.removeCard(card.id)
}

@Component({
  templateUrl: 'rename-dialog.html',
})
export class RenameDialogComponent {
  constructor(public dataService: DataService) { }

  renameStack(event: Event) {
    event.preventDefault()
    const newName = (document.getElementById('newNameInput') as HTMLInputElement).value

    this.dataService.updateActiveStack({ name: newName })
    const newStacks = this.dataService.persistentData.stacks
      .sort((a: Stack, b: Stack) => a.name > b.name ? 1 : -1)
    this.dataService.updatePersistentData({ stacks: newStacks })

    renameDialogRef.close([])
  }
}

@Component({
  templateUrl: './play-order.html',
  styles: [`
    div { display: flex; justify-content: space-evenly; }
  `],
})
export class PlayOrderComponent {
  cardSide: typeof CardSide = CardSide

  constructor(public dataService: DataService, public dialog: MatDialog) {
  }

  openRunDialog = (choseTopSide: CardSide) => {
    this.dialog.closeAll()
    this.dataService.chosenCardSide = choseTopSide
    this.dialog.open(RunDialogComponent)
  }
}
