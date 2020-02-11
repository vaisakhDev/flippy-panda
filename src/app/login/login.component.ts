import { Component, OnInit } from '@angular/core'
import { FirebaseService } from '../firebase.service'
import { DataService } from '../data.service'

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
