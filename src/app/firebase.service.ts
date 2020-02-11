import { Injectable } from '@angular/core'
import { User } from './interfaces'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { DataService } from './data.service'

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public dataService: DataService,
  ) {
    // Get the auth state, then fetch the Firestore user document or return null
    this.dataService.user$ = this.afAuth.authState.pipe(
      switchMap((user: User) => {
        // Logged in
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          // Logged out
          return of(null)
        }
      }),
    )
  }

  signIn(authResult) {
    switch (authResult.additionalUserInfo.providerId) {
      case 'google.com':
        this.updateUserDataByGoogle(authResult.user); break
    }
  }

  private updateUserDataByGoogle({ uid, email, displayName, photoURL }: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`)

    const data: User = {
      uid,
      email,
      displayName,
      photoURL,
    }

    return userRef.set(data, { merge: true })
  }

  async signOut() {
    await this.afAuth.auth.signOut()
  }
}
