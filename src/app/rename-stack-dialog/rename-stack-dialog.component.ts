import { Component } from '@angular/core'
import { DataService } from '../#services/data.service'
import { Stack } from '../interfaces'
import { MatDialog } from '@angular/material/dialog'


@Component({
  selector: 'app-rename-stack-dialog',
  templateUrl: './rename-stack-dialog.component.html',
  styleUrls: ['./rename-stack-dialog.component.scss'],
})
export class RenameStackDialogComponent {

  constructor(public dataService: DataService, public dialog: MatDialog) { }

  renameStack(event: Event) {
    event.preventDefault()
    const newName = (document.getElementById('newNameInput') as HTMLInputElement).value

    this.dataService.updateActiveStack({ name: newName })
    const newStacks = this.dataService.getActiveRealm().stacks
      .sort((a: Stack, b: Stack) => a.name > b.name ? 1 : -1)
    this.dataService.updatePersistentData({ stacks: newStacks })

    this.dialog.getDialogById('rename-stack-dialog').close([])
  }
}
