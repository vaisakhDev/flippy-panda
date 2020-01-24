import { Component } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { StackService } from '../stack.service'
import { PersistentData } from '../interfaces'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  persistentData: PersistentData

  constructor(
    private breakpointObserver: BreakpointObserver,
    public service: StackService) {
    this.persistentData = service.persistentData
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    )

  changeActiveStack(id: string) {
    this.service.updateActiveStack(id)
  }

  closeBanner = () => this.service.save({ banner: false })
}
