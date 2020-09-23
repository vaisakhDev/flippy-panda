import { Component, AfterViewInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { DataService } from "../#services/data.service";
// import { FirebaseService } from "../#services/firebase.service";
import { PersistentData } from "../interfaces";
import { MatDialog } from "@angular/material/dialog";
import { LoginComponent } from "../login/login.component";
import gsap from "gsap";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent implements AfterViewInit {
  constructor(
    private breakpointObserver: BreakpointObserver,
    public dataService: DataService,
    public dialog: MatDialog // public fbService: FirebaseService
  ) {
    this.persistentData = dataService.persistentData;
  }
  persistentData: PersistentData;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

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
    this.dialog.open(LoginComponent);
  };

  changeActiveDeck = (id: string) =>
    this.dataService.updatePersistentData({
      ...this.dataService.persistentData,
      activeDeckId: id,
    });

  closeBanner = () => this.dataService.updatePersistentData({ banner: false });
}
