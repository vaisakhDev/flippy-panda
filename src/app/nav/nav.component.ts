import { Component, AfterViewInit } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { DataService } from '../#services/data.service'
// import { FirebaseService } from "../#services/firebase.service"
import { Data } from '../interfaces'
import { MatDialog } from '@angular/material/dialog'
import { LoginComponent } from '../login/login.component'
import {
  faCat,
  faPlus,
  faEdit,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import gsap from 'gsap'
import { Realm } from '../interfaces'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements AfterViewInit {
  constructor(
    private breakpointObserver: BreakpointObserver,
    public dataService: DataService,
    public dialog: MatDialog // public fbService: FirebaseService
  ) {
    this.data = dataService.data
  }
  data: Data
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    )
  faCat = faCat
  faPlus = faPlus
  faEdit = faEdit
  faTimes = faTimes

  ngAfterViewInit() {
    // overlay animation
    // const subscriber = this.dataService.user$.subscribe(() => {
    //   gsap.to('#overlay', { opacity: 0, delay: 0.3 }).then(() => {
    //     document.getElementById('overlay').remove()
    //   })
    //   subscriber.unsubscribe()
    // })
  }

  openPlayOrderDialog = () => {
    this.dialog.open(LoginComponent)
  }

  readLocalStorageValue() {
    return localStorage.getItem('flippyPanda')
  }

  closeBanner = () =>
    this.dataService.setData({ ...this.dataService.getData() })
}
