import { Component, Inject } from '@angular/core'
import { DataService } from '../#services/data.service'
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-rename-deck-dialog',
  templateUrl: './rename-deck-dialog.component.html',
  styleUrls: ['./rename-deck-dialog.component.scss'],
})
export class RenameDeckDialogComponent {
  constructor(
    public dataService: DataService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  rename(event: Event) {
    event.preventDefault()

    const newName = (document.getElementById('newValue') as HTMLInputElement)
      .value

    eval(
      `this.dataService.${this.data.fun.name}(${Object.keys({ newName })[0]})`
    )

    this.dialog.getDialogById('rename-deck-dialog').close([])
  }
}
