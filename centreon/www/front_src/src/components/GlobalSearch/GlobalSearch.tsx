import { flatten, isEmpty } from 'ramda';
import { useNavigate } from 'react-router-dom';

import { Backdrop, Paper } from '@mui/material';

import { ActionsList, TextField } from '@centreon/ui';

import { labelGlobalSearch } from './transtaledLabels';
import { useGlobalSearchStyles } from './GlobalSearch.styles';
import { useGlobalSearch } from './useGlobalSearch';
import { useSearch } from './useSearch';
import { useSearchData } from './useSearchData';
import { globalSearchTypeMapping } from './models';
import ActionItem from './ActionItem';
import LoadingAdornment from './LoadingAdornment';

const GlobalSearch = (): JSX.Element => {
  const { classes } = useGlobalSearchStyles();
  const { change, currentSearchValue, click, searchValue, clearInput } =
    useSearch();
  const { isLoading, hasDatas, datas, invalidateQueries } =
    useSearchData(searchValue);

  const navigate = useNavigate();

  const { isOpen, close } = useGlobalSearch({ clearInput, invalidateQueries });

  const actions = hasDatas
    ? flatten(
        Object.entries(datas).map(([type, data]) => {
          if (!data?.result || isEmpty(data?.result)) {
            return undefined;
          }

          const globalSearchTypeHelpers = globalSearchTypeMapping(type);

          const itemActions = data?.result.map(({ id, name, uuid, links }) => {
            return {
              key: `${id}_${name}`,
              label: <ActionItem name={name} />,
              onClick: () => {
                navigate(
                  globalSearchTypeHelpers.itemNavigation({
                    id,
                    resourcesDetailsEndpoint: links?.endpoints.details,
                    uuid
                  })
                );
                close();
              }
            };
          });

          return [
            {
              Icon: globalSearchTypeHelpers.Icon,
              key: globalSearchTypeHelpers.title,
              label: globalSearchTypeHelpers.title,
              variant: 'group'
            },
            ...(itemActions || [])
          ];
        })
      ).filter((v) => v)
    : [];

  return (
    <>
      <Backdrop className={classes.container} open={isOpen} onClick={close}>
        <div className={classes.inputContainer}>
          {isOpen && (
            <Paper
              className={classes.paper}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={classes.inputWrapper}>
                <TextField
                  autoFocus
                  EndAdornment={
                    !!searchValue && isLoading ? LoadingAdornment : undefined
                  }
                  className={classes.input}
                  containerClassName={classes.field}
                  dataTestId={labelGlobalSearch}
                  label={labelGlobalSearch}
                  size="large"
                  value={currentSearchValue}
                  onChange={change}
                  onClick={click}
                />
              </div>
              <div>
                <ActionsList actions={actions} className={classes.actions} />
              </div>
            </Paper>
          )}
        </div>
      </Backdrop>
      <div />
    </>
  );
};

export default GlobalSearch;
