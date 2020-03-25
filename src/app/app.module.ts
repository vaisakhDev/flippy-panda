import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { LayoutModule } from '@angular/cdk/layout'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatTableModule } from '@angular/material/table'
import { MatInputModule } from '@angular/material/input'
import { MatDialogModule } from '@angular/material/dialog'
import { MatCardModule } from '@angular/material/card'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSelectModule } from '@angular/material/select'
import { MatFormFieldModule } from '@angular/material/form-field'

import { NavComponent } from './nav/nav.component'
import { PlayDialogComponent } from './play-dialog/play-dialog.component'
import { DeckComponent } from './deck/deck.component'
import { RenameDeckDialogComponent } from './rename-deck-dialog/rename-deck-dialog.component'

import { AngularFireModule } from '@angular/fire'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireStorageModule } from '@angular/fire/storage'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFireAnalyticsModule } from '@angular/fire/analytics'
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular'
import { LoginComponent } from './login/login.component'

import { GravatarModule } from 'ngx-gravatar'

const config = {
  apiKey: 'AIzaSyC9kKBqV1hj8eWyvDPHvMwvQqBT7LTESxY',
  authDomain: 'flippy-panda.firebaseapp.com',
  databaseURL: 'https://flippy-panda.firebaseio.com',
  projectId: 'flippy-panda',
  storageBucket: 'flippy-panda.appspot.com',
  messagingSenderId: '1036267992254',
  appId: '1:1036267992254:web:21677fd7a8b6ba763c5aef',
  measurementId: 'G-4QX44GW0LG',
}

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    PlayDialogComponent,
    DeckComponent,
    LoginComponent,
    RenameDeckDialogComponent,
  ],
  entryComponents: [
    PlayDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireAnalyticsModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    GravatarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
