import { Component, ViewChild } from '@angular/core'
import { MatTable } from '@angular/material'
import { DataService } from '../data.service'
import { MatInput } from '@angular/material/input'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { PersistentData, Card } from '../interfaces'
import { PlayDialogComponent } from '../play-dialog/play-dialog.component'
import { RenameStackDialogComponent } from '../rename-stack-dialog/rename-stack-dialog.component'

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

  openPlayDialog = () => {
    if (this.dataService.activeStack.cards.length > 0) {
      this.dialog.open(PlayDialogComponent)
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

  openRenameStackDialog = () => this.dialog.open(RenameStackDialogComponent, { id: 'rename-stack-dialog' })

  removeStack = () => this.dataService.removeStack()

  removeCard = (card: Card) => this.dataService.removeCard(card.id)
}
