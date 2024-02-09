import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  constructor() {}

  getLocalStorageValue(key: string) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : undefined;
  }

  setLocalStorageValue(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  getSessionStorageValue(key: string) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : undefined;
  }

  setSessionStorageValue(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  removeFromSessionStorage(key: string) {
    sessionStorage.removeItem(key);
  }

  clearSessionStorage() {
    sessionStorage.clear();
  }
}
