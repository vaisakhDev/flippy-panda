import { Component, OnInit } from '@angular/core'
import { FirebaseService } from '../firebase.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(public firebase: FirebaseService) { }

  ngOnInit(): void {
  }

}
