import { createRoot } from 'react-dom/client';

import Main from './Main';

import { Workbox } from "workbox-window";

const container = document.getElementById('root') as HTMLElement;

const createApp = async (): Promise<void> => {
  window.React = await import(/* webpackChunkName: "external" */ 'react');

  if ('serviceWorker' in navigator) {
    console.log('yess')
    const wb = new Workbox('./static/service-worker.js');
    
    wb.register();
    wb.update();
  }

  createRoot(container).render(<Main />);
};

createApp();
