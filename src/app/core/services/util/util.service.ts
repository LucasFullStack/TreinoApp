import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  getDateTimeNow() {
    let date = new Date();
    let data2 = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
    return data2.toISOString().replace(/\.\d{3}Z$/, '');
  }
}
