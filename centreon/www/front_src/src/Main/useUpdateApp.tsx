import * as React from 'react';

const useUpdateApp = () => {
  const updateApp = () => {
    console.log('updateApp')
    window.location.reload();
  }

  console.log('useUpdateApp')

  React.useEffect(() => {
    navigator.serviceWorker.addEventListener('controllerchange', updateApp);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', updateApp);
    }
  }, []);
}

export default useUpdateApp;