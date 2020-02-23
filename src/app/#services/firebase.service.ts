import { Injectable } from '@angular/core'
import { User } from '../interfaces'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { of } from 'rxjs'
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
          return this.afs.doc<User>(`users/${user.email}`).valueChanges()
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

  private updateUserDataByGoogle({ email, displayName }: User) {
    return this.afs.doc(`users/${email}`).get().toPromise().then(user => {
      if (!user.exists) {
        return this.afs.doc(`users/${email}`)
          .set({
            email,
            displayName,
          }, { merge: true })
      } else {
        return user.data()
      }
    })
  }

  async signOut() {
    await this.afAuth.auth.signOut()
  }
}
