import { Typography } from '@mui/material';
import EastIcon from '@mui/icons-material/East';

import { useActionItemStyles } from './GlobalSearch.styles';

const ActionItem = ({ name }): JSX.Element => {
  const { classes } = useActionItemStyles();

  return (
    <Typography className={classes.actionItem}>
      {name} <EastIcon fontSize="small" />
    </Typography>
  );
};

export default ActionItem;
