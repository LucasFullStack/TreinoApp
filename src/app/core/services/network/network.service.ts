import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx'
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController, Platform } from '@ionic/angular';
 
export enum ConnectionStatus {
  Online,
  Offline
}
 
@Injectable({
  providedIn: 'root'
})
export class NetworkService {
 
  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);
 
  constructor(private network: Network, 
              private toastController: ToastController, 
              private plt: Platform) {
    this.plt.ready().then(() => {
      this.initializeNetworkEvents();
      let status =  this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(status);
    });
  }
 
  public initializeNetworkEvents() {
 
    this.network.onDisconnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Online) {
        console.log('Você está offline!');
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });
 
    this.network.onConnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Offline) {
        console.log('Você está online!');       
        this.updateNetworkStatus(ConnectionStatus.Online);
      }
    });
  }
 
  private async updateNetworkStatus(status: ConnectionStatus) {
   
    this.status.next(status);
 
    let connection = status == ConnectionStatus.Offline ? 'offline' : 'online';
    
    let toast = this.toastController.create({
      message: `Você está ${connection}`,
      duration: 3000,
      position: "top",
      cssClass:'toast'
    });
    toast.then(toast => toast.present());
  }
 
  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }
 
  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }
}