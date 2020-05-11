import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

const API_STORAGE_KEY = 'treinos';
const API_URL = environment.API_URL + "api/treinos";

@Injectable({
  providedIn: 'root'
})
export class TreinosStorage {

  constructor(private storage: Storage) { }

  getKeySemanaDias(){
    const params = new HttpParams()
                       .set('dataAtualizacao', '1991-09-08');
    return API_URL + "/semana/dias?" + params.toString();
  }

  getKeyTreinoSemana(){
    const params = new HttpParams()
                       .set('dataAtualizacao', '1991-09-08');
    return API_URL + "/Treino/Semana?" + params.toString();
  }


  getAPI_URL(){
    return API_URL;
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
