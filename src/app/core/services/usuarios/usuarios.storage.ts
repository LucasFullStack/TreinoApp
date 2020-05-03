import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const API_STORAGE_KEY = 'usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsuariosStorage {

  constructor(private storage: Storage) { }

  // Save result of API requests
  setLocalData(key, data) {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }

  // Get cached API result
  getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }
}
