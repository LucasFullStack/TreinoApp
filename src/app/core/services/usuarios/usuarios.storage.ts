import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

const API_STORAGE_KEY = 'usuarios';
const API_URL = environment.API_URL + "api/usuarios";

@Injectable({
  providedIn: 'root'
})
export class UsuariosStorage {

  constructor(private storage: Storage) { }

  getKeyDisplayName(){
    const params = new HttpParams()
                       .set('dataAtualizacao', '1991-09-08');
    return API_URL + "/display?" + params.toString();
  }

  // Save result of API requests
  setLocalData(key, data) {
    return this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }

  // Get cached API result
  getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }
}
