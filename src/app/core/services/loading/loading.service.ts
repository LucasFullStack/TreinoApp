import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading : boolean;
  constructor(private loadingController: LoadingController) { }

  async presentLoading(message?: string) {
		this.isLoading = true;
		return await this.loadingController.create({
		  message: message,
		}).then((a) => {
		  a.present().then(() => {
			console.log('presented');
			if (!this.isLoading) {
			  a.dismiss().then(() => console.log('abort presenting'));
			}
		  });
		});
	  }
	
	  async dismissLoading() {
		this.isLoading = false;
		return await this.loadingController.dismiss().then(() => console.log('dismissed'));
	  }
}
