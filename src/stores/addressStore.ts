import { defineStore } from "pinia";

export const useAddressStore = defineStore("address", () => {
  const STORAGE_KEY = "address";

  function readFromLocalStorage(): any | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  function save(payload: unknown) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function clearLocalStorage() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { readFromLocalStorage, save, clearLocalStorage };
});
