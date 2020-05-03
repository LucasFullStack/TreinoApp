import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  async presentSuccessAlertDefault(header: string, message: string) {
    const _alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await _alert.present();
  }

  
  async presentErrorAlertDefault(header: string, message: string) {
    const _alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await _alert.present();
  }

  async presentAlertConfirm(msg: string) {
    let choice;
    const alert = await this.alertController.create({
      header: 'Atenção!',
      message: msg,
      buttons: [
        {
          text: 'Não',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Sim',
          role: 'yes',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();

    await alert.onDidDismiss().then((data) => {
      choice = data
  })
   return choice.role;
  }

  async presentAlertConfirmCustomCss(msg: string, cssClass: string) {
    let choice;
    const alert = await this.alertController.create({
      header: 'Atenção!',
      message: msg,
      cssClass: cssClass,
      buttons: [
        {
          text: 'Não',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Sim',
          role: 'yes',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();

    await alert.onDidDismiss().then((data) => {
      choice = data
  })
   return choice.role;
  }

  async presentAlertConfirmChanges(msg: string) {
    let choice;
    const alert = await this.alertController.create({
      header: 'Atenção!',
      message: msg,
      buttons: [
   
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
  
        {
          text: 'Não',
          role: 'no',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, 
        {
          text: 'Sim',
          role: 'yes',
          handler: () => {
          }
        },
        
      ]
    });

    await alert.present();

    await alert.onDidDismiss().then((data) => {
      choice = data
  })
   return choice.role;
  }

}
