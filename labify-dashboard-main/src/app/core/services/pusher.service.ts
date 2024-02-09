import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Pusher from 'pusher-js';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PusherService {
  private pusher: Pusher;

  constructor(private authService: AuthService) {
    // this.pusher = new Pusher(environment.pusherKey, {
    //   cluster: 'mt1',
    //   authEndpoint:
    //     'https://labify-backend.developnetwork.net/broadcasting/auth',
    //   auth: {
    //     headers: {
    //       Authorization: `Bearer ${this.authService.getToken()}`,
    //     },
    //   },
    // });
    this.pusher = new Pusher('255b389e67e95ff85236', {
      cluster: 'eu',
    });
  }

  subscribeChannel(channelName: string, eventName: string) {
    // const channel = this.pusher.subscribe(channelName);
    const channel = this.pusher.subscribe('my-chanel');
    const eventSubject = new BehaviorSubject<any>(null);

    // channel.bind(eventName, (data: any) => {
    //   eventSubject.next(data);
    // });

    channel.bind('event-event', (data: any) => {
      eventSubject.next(data);
    });

    return eventSubject.asObservable();
  }
}
