import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { LayoutModule } from '@angular/cdk/layout'

import material from './app.material'

import { NavComponent } from './nav/nav.component'
import { PlayDialogComponent } from './play-dialog/play-dialog.component'
import { DeckComponent } from './deck/deck.component'
import { RenameDeckDialogComponent } from './rename-deck-dialog/rename-deck-dialog.component'

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    PlayDialogComponent,
    DeckComponent,
    RenameDeckDialogComponent,
  ],
  entryComponents: [PlayDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    ...material,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
