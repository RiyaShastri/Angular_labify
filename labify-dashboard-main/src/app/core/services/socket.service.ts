import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  listenToEvent(eventName: string): Observable<any> {
    return this.socket.fromEvent(eventName);

  }

  emitEvent(eventName: string): void {
    this.socket.emit(eventName);
    console.log('emit', eventName);
  }
}
