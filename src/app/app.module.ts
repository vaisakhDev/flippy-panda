import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserModule } from '@angular/platform-browser'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { LayoutModule } from '@angular/cdk/layout'
import { NgModule } from '@angular/core'

import { DeckComponent } from './deck/deck.component'
import { NavComponent } from './nav/nav.component'
import { PlayDialogComponent } from './play-dialog/play-dialog.component'
import { RenameDeckDialogComponent } from './rename-deck-dialog/rename-deck-dialog.component'

import material from './app.material';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment'

@NgModule({
  declarations: [
    AppComponent,
    DeckComponent,
    NavComponent,
    PlayDialogComponent,
    RenameDeckDialogComponent,
  ],
  entryComponents: [PlayDialogComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule,
    LayoutModule,
    ...material,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
