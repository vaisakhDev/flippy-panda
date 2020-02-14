import { Component, OnInit } from '@angular/core'
import { FirebaseService } from '../#services/firebase.service'
import { DataService } from '../#services/data.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    public fbService: FirebaseService,
    public dataService: DataService,
  ) { }

  ngOnInit(): void {
  }

}
