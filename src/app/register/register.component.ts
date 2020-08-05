import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  profileForm = new FormGroup({
    nome: new FormControl(''),
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

  register(user: any){
    const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');
    
    this.http.post(`${this.apiURL}/register`, user, { 'headers': headers })
      .subscribe(result => {
        console.log(result)
        window.localStorage.setItem('currentUser', JSON.stringify(result));
        this.r.navigate(['/home']);
    });
  }

  onSubmit() {
    this.register(this.profileForm.value);
  }

}
