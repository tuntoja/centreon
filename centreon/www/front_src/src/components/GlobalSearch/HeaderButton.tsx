import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import SearchIcon from '@mui/icons-material/Search';

import { IconButton } from '@centreon/ui';

import { isGlobalSearchOpen } from './atoms';
import { labelGlobalSearch } from './transtaledLabels';

const GlobalSearchHeaderButton = (): JSX.Element => {
  const { t } = useTranslation();
  const setIsGlobalSearchOpen = useSetAtom(isGlobalSearchOpen);

  const openGlobalSearch = (): void => setIsGlobalSearchOpen(true);

  const isMacOS = window.navigator.userAgent.includes('Macintosh');

  return (
    <IconButton
      title={`${t(labelGlobalSearch)} (${isMacOS ? '⌘' : 'ctrl'}+k)`}
      onClick={openGlobalSearch}
    >
      <SearchIcon sx={{ color: 'common.white' }} />
    </IconButton>
  );
};

export default GlobalSearchHeaderButton;
