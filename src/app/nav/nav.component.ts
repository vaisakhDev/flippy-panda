import { Component } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { StackService } from '../stack.service'
import { FirebaseService } from '../firebase.service'
import { PersistentData } from '../interfaces'
import { MatDialog } from '@angular/material/dialog'
import { LoginComponent } from '../login/login.component'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  persistentData: PersistentData

  constructor(
    private breakpointObserver: BreakpointObserver,
    public service: StackService,
    public dialog: MatDialog,
    public firebase: FirebaseService) {
    this.persistentData = service.persistentData
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay(),
    )

  openPlayOrderDialog = () => {
    this.dialog.open(LoginComponent)
  }

  changeActiveStack = (id: string) => this.service.SetActiveStackId(id)
  closeBanner = () => this.service.updatePersistentData({ banner: false })
}
