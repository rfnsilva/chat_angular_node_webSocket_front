import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private url = 'http://localhost:3333';
  private socket;

  constructor() {
    this.socket = io(this.url);
  }

  public enviarMensagem(message) {
    this.socket.emit('new-message', message);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
          observer.next(message);
      });
    });
}
}
