/* eslint-disable react/no-array-index-key */
import { ReactElement } from 'react';

import { useTranslation } from 'react-i18next';
import { equals, type } from 'ramda';

import {
  MenuList,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Divider,
  SvgIconTypeMap
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

import { sanitizedHTML } from '..';

import { useStyles } from './ActionsList.styles';
import { ActionVariants } from './models';

interface ActionsType {
  Icon?: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
    muiName: string;
  };
  iconPlacement?: 'start' | 'end';
  label: string | ReactElement;
  onClick?: (e?) => void;
  secondaryLabel?: string;
  variant?: ActionVariants;
}

export enum ActionsListActionDivider {
  divider = 'divider'
}
export type ActionsListActions = Array<ActionsType | ActionsListActionDivider>;

interface Props {
  actions: ActionsListActions;
  className?: string;
  listItemClassName?: string;
}

const ActionsList = ({
  className,
  listItemClassName,
  actions
}: Props): JSX.Element => {
  const { cx, classes } = useStyles();
  const { t } = useTranslation();

  return (
    <MenuList className={cx(classes.list, className)}>
      {actions?.map((action, idx) => {
        if (equals(action, ActionsListActionDivider.divider)) {
          return <Divider key={`divider_${idx}`} />;
        }

        const { label, Icon, onClick, variant, secondaryLabel, iconPlacement } =
          action as ActionsType;

        return (
          <MenuItem
            aria-label={label}
            className={classes.item}
            data-variant={variant}
            disabled={equals(variant, 'group')}
            id={label}
            key={label}
            onClick={onClick}
          >
            {Icon && (equals(iconPlacement, 'start') || !iconPlacement) && (
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
            )}
            <ListItemText
              className={listItemClassName}
              primary={
                equals(type(label), 'String') ? t(label as string) : label
              }
              secondary={
                secondaryLabel &&
                sanitizedHTML({ initialContent: t(secondaryLabel) })
              }
            />
            {Icon && equals(iconPlacement, 'end') && (
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
            )}
          </MenuItem>
        );
      })}
    </MenuList>
  );
};

export default ActionsList;
