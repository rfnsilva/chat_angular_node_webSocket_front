import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

import * as io from 'socket.io-client';
import * as $ from 'jquery';
import { WebsocketService } from '../websocket.service';

const api_url = 'https://chat-angular-nodets.herokuapp.com'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  profileForm = new FormGroup({
    mensagem_enviar: new FormControl('')
  });
  readonly apiURL: string;
  @Input()
  public verifica_grupo: boolean = false;

  public user_email: any;
  public data_string: string;
  public data_string1: string;

  @Input()
  public grupos: any;
  @Input()
  public grupo: any;
  @Input()
  public mensagens: any[];

  @Input()
  public mensagem_socket: any;
    
  public socket;

  constructor(private http : HttpClient){
    this.apiURL = 'http://localhost:3333';
  }

  geraHTML(data: any) {
    let autor = data.userName;
    let mensagem = data.mensagem;
    let date = new Date();
    let hr = date.getHours();
    let min = date.getMinutes();
    let se = date.getSeconds();
    let MM = date.getMonth();
    let DD = date.getDate();
    let AA = date.getFullYear();

    this.data_string = DD + '/' + MM + '/' + AA + '&nbsp &nbsp &nbsp' + hr + ':' + min + ':' + se;

    let card_html = `
      <div class="row remove" style="margin-bottom: 6px !important;">
        <div class="card" style="background-color: #36393f;">
          <div class="card-body" style="display: flex;padding: 5px 0;justify-content: space-between;">
            <h5 class="card-title">${this.data_string}</h5>
            <p class="card-text" style="float: right;">${autor}</p>
          </div>
          <p>${mensagem}</p>
        </div>
      </div>
    `;
    
    $(card_html).appendTo("#repetir");

  }

  setupSocketConnection() {
    this.socket = io(api_url);

    this.socket.on('message-broadcast', (data: any) => {
      if (data) {
        if (this.grupo.id == data.grupoId) {
          this.geraHTML(data);
        }
      }
    });
  }

  ngOnInit(): void {
    let user_data = JSON.parse(window.localStorage.getItem('currentUser'))
 
    this.user_email = user_data.email;


    this.setupSocketConnection()

    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('authorization', `bearer ${user_data.token}`);
    
    
    this.http.get(`${this.apiURL}/grupos`, { 'headers': headers })
      .subscribe(result => {
        this.grupos = result;
      });
    
  }
  
  getMessageGrupo(id: string){
    let user_data = JSON.parse(window.localStorage.getItem('currentUser'));

    $(".remove").remove();

    this.verifica_grupo = true;

    const headers = new HttpHeaders()
     .set('content-type', 'application/json')
     .set('Access-Control-Allow-Origin', '*')
     .set('authorization', `bearer ${user_data.token}`);
    
    this.http.get(`${this.apiURL}/grupo/${id}`, { 'headers': headers })
     .subscribe(result => {
       this.grupo = result;
       this.mensagens = this.grupo.mensagens
     });
    
  }

  enviar(mensagem: any) {
    let user_data = JSON.parse(window.localStorage.getItem('currentUser'))

    if (mensagem.mensagem_enviar !== "") {
      let prototipo_mensagem = {
        mensagem: `${mensagem.mensagem_enviar}`,
        userId: `${user_data.id}`,
        grupoId: `${this.grupo.id}`,
        userName: `${user_data.nome}`
      }


      this.socket.emit('new-message', prototipo_mensagem)

      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', '*')
        .set('authorization', `bearer ${user_data.token}`);
      
      this.http.post(`${this.apiURL}/add_mensagem`, prototipo_mensagem, { 'headers': headers })
        .subscribe(result => {
          this.grupo = result;
          this.geraHTML(prototipo_mensagem);
        });
    } else {
      console.log('texto vazio')
    }
  }

  onSubmit() {
    this.enviar(this.profileForm.value);
  }

}
