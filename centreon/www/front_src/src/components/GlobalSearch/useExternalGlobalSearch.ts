import { useEffect } from 'react';

import { useSetAtom } from 'jotai';

import { isGlobalSearchOpen } from './atoms';

export const useExternalSearch = (dependencies?: Array<unknown>): void => {
  const setIsGlobalSearchOpen = useSetAtom(isGlobalSearchOpen);

  const toggle = (): void =>
    setIsGlobalSearchOpen((currentIsOpen) => !currentIsOpen);

  const toggleSearchBar = (event: KeyboardEvent): void => {
    const isMetaOrCtrlDown = event.metaKey || event.ctrlKey;

    if (event.key !== 'k' || !isMetaOrCtrlDown) {
      return;
    }

    toggle();
  };

  useEffect(() => {
    document
      .getElementById('main-content')
      ?.contentWindow.document.addEventListener('keydown', toggleSearchBar);

    return () => {
      document
        .getElementById('main-content')
        ?.contentWindow.document.removeEventListener(
          'keydown',
          toggleSearchBar
        );
    };
  }, dependencies || []);
};
