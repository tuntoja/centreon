import { Action } from '../Criterias/models';
import { createFilter, updateFilter } from '../api';

import CreateFilterDialog from './CreateFilterDialog';

const initialize = (isCreating): unknown => {
  const callbackSuccess = cy.stub();

  cy.mount({
    Component: (
      <CreateFilterDialog
        open
        action={isCreating ? Action.create : Action.update}
        callbackSuccess={callbackSuccess}
        payloadAction={
          isCreating
            ? {
                filter: {}
              }
            : {
                filter: {
                  name: 'Filter'
                }
              }
        }
        request={isCreating ? createFilter : updateFilter}
        onCancel={cy.stub()}
      />
    )
  });

  return callbackSuccess;
};

describe();
