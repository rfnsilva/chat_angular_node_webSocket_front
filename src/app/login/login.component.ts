import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  profileForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  readonly apiURL : string;
  public rota: Router;

  constructor(private http : HttpClient, private r: Router){
    this.apiURL = 'https://chat-angular-nodets.herokuapp.com';
    this.rota = r;
  }

  ngOnInit(): void {
  }

  login(user: any){
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');
    
    this.http.post(`${this.apiURL}/login`, user, { 'headers': headers })
      .subscribe(result => {
        window.localStorage.setItem('currentUser', JSON.stringify(result));
        this.r.navigate(['/home']);
    });
    
  }

  onSubmit() {
    this.login(this.profileForm.value);
  }
}
