import { Component } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { StackService } from '../stack.service'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  constructor(
    private breakpointObserver: BreakpointObserver,
    public service: StackService) {
    this.mainState = service.mainState
  }
  mainState

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    )

  changeActiveStack(id) {
    this.service.updateActiveStack(id)
  }

  closeBanner() {
    this.mainState.banner = false
    this.service.updateLocalStorage()
  }

}
