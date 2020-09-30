import { Component } from '@angular/core'
import { DataService } from '../#services/data.service'
import { Deck } from '../interfaces'
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'app-rename-deck-dialog',
  templateUrl: './rename-deck-dialog.component.html',
  styleUrls: ['./rename-deck-dialog.component.scss'],
})
export class RenameDeckDialogComponent {
  constructor(public dataService: DataService, public dialog: MatDialog) {}

  renameDeck(event: Event) {
    event.preventDefault()
    const newName = (document.getElementById(
      'newNameInput'
    ) as HTMLInputElement).value

    this.dataService.updateActiveDeck({ name: newName })

    // sort decks
    const realm = this.dataService.getActiveRealm()
    const otherRealms = this.dataService.data.realms.filter(
      (actRealm) => actRealm !== realm
    )
    const newDecks = this.dataService
      .getActiveRealm()
      .decks.sort((a: Deck, b: Deck) => (a.name > b.name ? 1 : -1))
    this.dataService.setData({
      ...this.dataService.data,
      realms: [
        ...otherRealms,
        {
          ...realm,
          decks: newDecks,
        },
      ],
    })

    this.dialog.getDialogById('rename-deck-dialog').close([])
  }
}
