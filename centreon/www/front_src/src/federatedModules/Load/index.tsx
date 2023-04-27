import { lazy, Suspense } from 'react';

import { importRemote } from '@module-federation/utilities';
import { isEmpty, isNil } from 'ramda';

import { MenuSkeleton, PageSkeleton } from '@centreon/ui';

import { StyleMenuSkeleton } from '../models';
import { store } from '../../Main/Provider';

import ErrorBoundary from './ErrorBoundary';
import FederatedModuleFallback from './FederatedModuleFallback';
import FederatedPageFallback from './FederatedPageFallback';

interface RemoteProps {
  component: string;
  isFederatedModule?: boolean;
  moduleFederationName: string;
  moduleName: string;
  remoteEntry: string;
  styleMenuSkeleton?: StyleMenuSkeleton;
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
  const Component = lazy(() =>
    importRemote({
      bustRemoteEntryCache: false,
      module: component,
      remoteEntryFileName: remoteEntry,
      scope: moduleFederationName,
      url: `./modules/${moduleName}/static`
    })
  );

  const fallback = isFederatedModule ? (
    <FederatedModuleFallback />
  ) : (
    <FederatedPageFallback />
  );

  if (!isNil(styleMenuSkeleton) && !isEmpty(styleMenuSkeleton)) {
    const { height, width, className } = styleMenuSkeleton;

    return (
      <ErrorBoundary fallback={fallback}>
        <Suspense
          fallback={
            isFederatedModule ? (
              <MenuSkeleton
                className={className}
                height={height}
                width={width}
              />
            ) : (
              <PageSkeleton />
            )
          }
        >
          <Component {...props} store={store} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallback={fallback}>
      <Suspense
        fallback={isFederatedModule ? <MenuSkeleton /> : <PageSkeleton />}
      >
        <Component {...props} store={store} />
      </Suspense>
    </ErrorBoundary>
  );
};
