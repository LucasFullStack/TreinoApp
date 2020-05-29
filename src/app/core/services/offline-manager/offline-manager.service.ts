import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from, of } from 'rxjs';
import { finalize, map, concatMap, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Guid } from 'guid-typescript';
import { UtilService } from '../util/util.service';

let STORAGE_REQ_KEY = 'storedreq';

interface StoredRequest {
  url: string,
  type: string,
  data: any,
  time: number,
  id: string,
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {
  syncing: boolean = false;
  success: boolean;

  constructor(private storage: Storage,
    private http: HttpClient,
    private toastController: ToastController,
    private utilService: UtilService) { }

  checkForEvents(syncDatabase: boolean = false): Observable<any> {
    if (this.syncing) {
      return of([]);
    }
    return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
      concatMap(storedOperations => {
        this.syncing = true;
        let storedObj: StoredRequest[] = JSON.parse(storedOperations);
        if (storedObj && storedObj.length > 0) {
          return this.sendRequests(storedObj.sort((a: StoredRequest, b: StoredRequest) => {
            return a.time - b.time;
          }))
            .pipe(
              finalize(async () => {
                if (syncDatabase) {
                  this.syncing = false;
                  return
                };
                if (this.success) {
                  let toast = this.toastController.create({
                    message: 'Dados sincronizados com sucesso!',
                    duration: 1000,
                    position: "top",
                    cssClass: 'toast'
                  });
                  setTimeout(() => {
                    //toast.then(toast => toast.present());
                  }, 3000)
                }
                this.syncing = false;
              }),
            );
        } else {
          this.syncing = false;
          console.log('Nenhum dado local para sincronizar');
          return of(false);
        }
      })
    )
  }

  storeRequest(url, type, data?) {

    let action: StoredRequest = {
      url: url,
      type: type,
      data: data,
      time: new Date().getTime(),
      id: Guid.create().toString(),
      date: this.utilService.getDateTimeNow(),
    };
    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

    return this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
      let storedObj = JSON.parse(storedOperations);
      if (storedObj) {
        storedObj.push(action);
      } else {
        storedObj = [action];
      }
      // Save old & new local transactions back to Storage
      return this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
    });
  }

  sendRequests(operations: StoredRequest[]): Observable<any[]> {
    return from(operations).pipe(
      concatMap(
        op =>
          <Observable<any>>(
            this.http.request(op.type, op.url, { "body": op.data }).pipe(
              map(async (success) => {
                this.success = true;
                await this.storage.get(STORAGE_REQ_KEY).then(async (data) => {
                  let storedObj = await JSON.parse(data);
                  await this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj.filter((item) => item.id != op.id)))
                })
              }),
              catchError(async (err: HttpErrorResponse) => {
                console.log(err)
                if(err.status == 400 || err.status == 404 || err.status == 405 || err.status == 406 || err.status == 500){
                  await this.storage.get(STORAGE_REQ_KEY).then(async (data) => {
                    let storedObj = await JSON.parse(data);
                    await this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj.filter((item) => item.id != op.id)))
                  })
                }else {
                  this.success = false;
                  console.log(err, 'error')
                  throw ('Something wrong happend!');
                }
              })
            )
          )
      ));
  }
}

