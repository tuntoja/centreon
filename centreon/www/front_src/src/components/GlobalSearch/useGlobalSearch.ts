import { useEffect } from 'react';

import { useAtom } from 'jotai';

import { isGlobalSearchOpen } from './atoms';

interface UseGlobalSearchState {
  close: () => void;
  isOpen: boolean;
  toggle: () => void;
}

export const useGlobalSearch = ({
  clearInput,
  invalidateQueries
}): UseGlobalSearchState => {
  const [isOpen, setIsOpen] = useAtom(isGlobalSearchOpen);

  const toggle = (): void =>
    setIsOpen((currentIsOpen) => {
      if (currentIsOpen) {
        clearInput();
      }

      return !currentIsOpen;
    });

  const close = (): void => {
    clearInput();
    invalidateQueries();
    setIsOpen(false);
  };

  const toggleSearchBar = (event: KeyboardEvent): void => {
    const isMetaOrCtrlDown = event.metaKey || event.ctrlKey;

    if (event.key !== 'k' || !isMetaOrCtrlDown) {
      return;
    }

    toggle();
  };

  useEffect(() => {
    window.addEventListener('keydown', toggleSearchBar);

    return () => {
      window.removeEventListener('keydown', toggleSearchBar);
    };
  }, []);

  return {
    close,
    isOpen,
    toggle
  };
};
