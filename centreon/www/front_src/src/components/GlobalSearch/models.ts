import { always, cond, equals } from 'ramda';
import { generatePath } from 'react-router-dom';

import DashboardIcon from '@mui/icons-material/Dashboard';
import MonitoringIcon from '@mui/icons-material/Dvr';
import SettingsIcon from '@mui/icons-material/Settings';

import routeMap from '../../reactRoutes/routeMap';

import {
  labelDashboards,
  labelHostsConfiguration,
  labelResourcesStatus,
  labelServicesConfiguration
} from './transtaledLabels';

export enum GlobalSearchType {
  dashboards = 'dashboards',
  hosts = 'hosts',
  resourceStatus = 'resources status',
  services = 'services'
}

export interface RetrievedData {
  id: number;
  links?: {
    endpoints: {
      details: string;
    };
  };
  name: string;
  uuid?: string;
}

export interface Listing {
  meta: object;
  result: Array<RetrievedData>;
}

export const globalSearchTypeMapping = cond([
  [
    equals(GlobalSearchType.dashboards),
    always({
      Icon: DashboardIcon,
      defaultNavigation: routeMap.dashboards,
      itemNavigation: ({ id }) =>
        generatePath(routeMap.dashboard, {
          dashboardId: id
        }),
      title: labelDashboards
    })
  ],
  [
    equals(GlobalSearchType.resourceStatus),
    always({
      Icon: MonitoringIcon,
      defaultNavigation: routeMap.resources,
      itemNavigation: ({ id, resourcesDetailsEndpoint, uuid }) => {
        const queryParameters = new URLSearchParams();
        queryParameters.set(
          'details',
          JSON.stringify({
            id,
            resourcesDetailsEndpoint,
            uuid
          })
        );

        return `${routeMap.resources}?${queryParameters.toString()}`;
      },
      title: labelResourcesStatus
    })
  ],
  [
    equals(GlobalSearchType.hosts),
    always({
      Icon: SettingsIcon,
      defaultNavigation: './main.php?p=60101',
      itemNavigation: ({ id }) => `/main.php?p=60101&o=c&host_id=${id}`,
      title: labelHostsConfiguration
    })
  ],
  [
    equals(GlobalSearchType.services),
    always({
      Icon: SettingsIcon,
      defaultNavigation: './main.php?p=60201',
      itemNavigation: ({ id }) => `/main.php?p=60201&o=c&service_id=${id}`,
      title: labelServicesConfiguration
    })
  ]
]);
