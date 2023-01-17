let registred = false

import { Workbox } from "workbox-window";

export const useServiceWorker = () => {
  if ("serviceWorker" in navigator && !registred) {
    const wb = new Workbox('./static/service-worker.js');
    wb.register().then(() => {
      registred = true
    }, (err) => {
      console.log('serviceWorker failed to register : ', err)
    })
  }
}