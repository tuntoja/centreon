import { makeStyles } from 'tss-react/mui';

const usePanelHeaderStyles = makeStyles()((theme) => ({
  panelActionsIcons: {
    columnGap: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row'
  },
  panelHeader: {
    padding: theme.spacing(1, 2)
  }
}));

export default usePanelHeaderStyles;
