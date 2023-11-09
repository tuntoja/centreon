import { ChangeEvent, useState } from 'react';

import { debounce } from '@mui/material';

interface UseSearchState {
  change: (event: ChangeEvent<HTMLInputElement>) => void;
  clearInput: () => void;
  click: (event: MouseEvent) => void;
  currentSearchValue: string;
  searchValue: string;
}

export const useSearch = (): UseSearchState => {
  const [currentSearchValue, setCurrentSearchValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const changeInput = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(event.target.value);
  };

  const debounceChange = debounce(changeInput, 500);

  const change = (event: ChangeEvent<HTMLInputElement>): void => {
    setCurrentSearchValue(event.target.value);

    debounceChange(event);
  };

  const click = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  const clearInput = (): void => {
    setCurrentSearchValue('');
    setSearchValue('');
  };

  return {
    change,
    clearInput,
    click,
    currentSearchValue,
    searchValue
  };
};
