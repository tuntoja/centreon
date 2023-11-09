import { makeStyles } from 'tss-react/mui';

export const useGlobalSearchStyles = makeStyles()((theme) => ({
  actions: {
    height: 'calc(100% - 15%)',
    overflowY: 'auto'
  },
  container: {
    alignItems: 'start',
    backdropFilter: 'blur(5px)',
    zIndex: theme.zIndex.tooltip + 1
  },
  field: {
    width: 'inherit'
  },
  input: {
    width: '60vw'
  },
  inputContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transform: 'translateY(15%)',
    width: '100%'
  },
  inputWrapper: {
    margin: theme.spacing(1.5, 1.5, 1)
  },
  loading: {
    height: 'inherit'
  },
  paper: {
    maxHeight: 'calc(100% - 40%)',
    transition: theme.transitions.create('height', {
      duration: theme.transitions.duration.standard
    }),
    zIndex: theme.zIndex.tooltip + 2
  }
}));

export const useActionItemStyles = makeStyles()((theme) => ({
  actionItem: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2)
  }
}));
