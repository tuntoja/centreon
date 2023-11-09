import { useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { buildListingEndpoint, useFetchQuery } from '@centreon/ui';

import { resourcesEndpoint } from '../../Resources/api/endpoint';
import { searchableFields } from '../../Resources/testUtils';
import { dashboardsEndpoint } from '../../Dashboards/api/endpoints';

import { GlobalSearchType, Listing } from './models';

interface UseSearchQueryDataState {
  datas: Record<GlobalSearchType, Listing | undefined> | undefined;
  hasDatas: boolean;
  invalidateQueries: () => void;
  isLoading: boolean;
}

export const useSearchData = (searchValue: string): UseSearchQueryDataState => {
  const queryClient = useQueryClient();

  const queryOptions = {
    enabled: !!searchValue,
    suspense: false
  };

  const datasRef = useRef<
    Record<GlobalSearchType, Listing | undefined> | undefined
  >(undefined);

  const { data: resourcesStatusData, isLoading: isResourseStatusLoading } =
    useFetchQuery<Listing>({
      getEndpoint: () => {
        return buildListingEndpoint({
          baseEndpoint: resourcesEndpoint,
          parameters: {
            limit: 5,
            search: {
              regex: {
                fields: searchableFields,
                value: searchValue
              }
            }
          }
        });
      },
      getQueryKey: () => ['global search', 'resources status', searchValue],
      queryOptions
    });

  const { data: dashboardsData, isLoading: isDashboardLoading } =
    useFetchQuery<Listing>({
      getEndpoint: () => {
        return buildListingEndpoint({
          baseEndpoint: dashboardsEndpoint,
          parameters: {
            limit: 5,
            search: {
              regex: {
                fields: ['name'],
                value: searchValue
              }
            }
          }
        });
      },
      getQueryKey: () => ['global search', 'dashboards', searchValue],
      queryOptions
    });

  const { data: hostsData, isLoading: isHostsLoading } = useFetchQuery<Listing>(
    {
      getEndpoint: () => {
        return buildListingEndpoint({
          baseEndpoint: './api/latest/configuration/hosts',
          parameters: {
            limit: 5,
            search: {
              regex: {
                fields: ['name'],
                value: searchValue
              }
            }
          }
        });
      },
      getQueryKey: () => ['global search', 'hosts', searchValue],
      queryOptions
    }
  );

  const { data: servicesData, isLoading: isServicesLoading } =
    useFetchQuery<Listing>({
      getEndpoint: () => {
        return buildListingEndpoint({
          baseEndpoint: './api/latest/configuration/services',
          parameters: {
            limit: 5,
            search: {
              regex: {
                fields: ['name'],
                value: searchValue
              }
            }
          }
        });
      },
      getQueryKey: () => ['global search', 'services', searchValue],
      queryOptions
    });

  const invalidateQueries = (): void => {
    datasRef.current = undefined;
    queryClient.invalidateQueries({ queryKey: ['global search'] });
  };

  const isLoading =
    isResourseStatusLoading ||
    isDashboardLoading ||
    isHostsLoading ||
    isServicesLoading;

  const hasRetrievedDatas =
    Boolean(dashboardsData) ||
    Boolean(hostsData) ||
    Boolean(resourcesStatusData) ||
    Boolean(servicesData);

  datasRef.current = hasRetrievedDatas
    ? {
        [GlobalSearchType.resourceStatus]: resourcesStatusData,
        [GlobalSearchType.dashboards]: dashboardsData,
        [GlobalSearchType.hosts]: hostsData,
        [GlobalSearchType.services]: servicesData
      }
    : datasRef.current;

  return {
    datas: datasRef.current,
    hasDatas:
      Boolean(datasRef.current?.dashboards) ||
      Boolean(datasRef.current?.hosts) ||
      Boolean(datasRef.current?.['resources status']) ||
      Boolean(datasRef.current?.services),
    invalidateQueries,
    isLoading
  };
};
