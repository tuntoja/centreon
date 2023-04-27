import { lazy, Suspense } from 'react';
import { importRemote } from '@module-federation/utilities';
import { isEmpty, isNil } from 'ramda';

import { MenuSkeleton, PageSkeleton } from '@centreon/ui';

import { StyleMenuSkeleton } from '../models';
import { store } from '../../Main/Provider';

interface RemoteProps {
  component: string;
  isFederatedModule?: boolean;
  moduleFederationName: string;
  styleMenuSkeleton?: StyleMenuSkeleton;
  moduleName: string;
  remoteEntry: string;
}

export const Remote = ({
  component,
  remoteEntry,
  moduleName,
  moduleFederationName,
  isFederatedModule,
  styleMenuSkeleton,
  ...props
}: RemoteProps): JSX.Element => {
  const Component = lazy(() => importRemote({
    remoteEntryFileName: remoteEntry,
    bustRemoteEntryCache: false,
    url: `./modules/${moduleName}/static`,
    scope: moduleFederationName,
    module: component
  }));

  if (!isNil(styleMenuSkeleton) && !isEmpty(styleMenuSkeleton)) {
    const { height, width, className } = styleMenuSkeleton;

    return (
      <Suspense
        fallback={
          isFederatedModule ? (
            <MenuSkeleton className={className} height={height} width={width} />
          ) : (
            <PageSkeleton />
          )
        }
      >
        <Component {...props} store={store} />
      </Suspense>
    );
  }

  return (
    <Suspense
      fallback={isFederatedModule ? <MenuSkeleton /> : <PageSkeleton />}
    >
      <Component {...props} store={store} />
    </Suspense>
  );
};
