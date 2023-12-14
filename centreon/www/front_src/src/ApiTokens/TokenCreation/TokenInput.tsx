import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import FileCopyIcon from '@mui/icons-material/FileCopy';

import { IconButton, TextField, useCopyToClipboard } from '@centreon/ui';

import {
  labelToken,
  labelTokenCopiedToTheClipboard,
  labelTokenCouldNotBeCopied
} from '../translatedLabels';

import { endAdornment } from './EndAdornment';

interface Props {
  token: string;
}

const TokenInput = ({ token }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  const { copy } = useCopyToClipboard({
    errorMessage: t(labelTokenCouldNotBeCopied),
    successMessage: t(labelTokenCopiedToTheClipboard)
  });

  const handleVisibility = (): void => {
    setIsVisible(!isVisible);
  };

  return (
    <div
      style={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}
    >
      <TextField
        EndAdornment={endAdornment({ isVisible, onClick: handleVisibility })}
        dataTestId="tokenInput"
        id="token"
        label={t(labelToken)}
        style={{ width: '100%' }}
        type={isVisible ? 'text' : 'password'}
        value={token}
      />
      <IconButton
        ariaLabel="clipboard"
        onClick={() => {
          copy(token);
        }}
      >
        <FileCopyIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

export default TokenInput;
