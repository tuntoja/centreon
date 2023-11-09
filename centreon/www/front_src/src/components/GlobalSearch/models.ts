import { always, cond, equals } from 'ramda';
import { generatePath } from 'react-router-dom';

import DashboardIcon from '@mui/icons-material/Dashboard';
import MonitoringIcon from '@mui/icons-material/Dvr';
import SettingsIcon from '@mui/icons-material/Settings';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import PersonIcon from '@mui/icons-material/Person';

import routeMap from '../../reactRoutes/routeMap';
import { labelContacts } from '../../Resources/translatedLabels';

import {
  labelDashboards,
  labelHostsConfiguration,
  labelMonitoringServers,
  labelResourcesStatus,
  labelServicesConfiguration
} from './transtaledLabels';

export enum GlobalSearchType {
  contacts = 'contacts',
  dashboards = 'dashboards',
  hosts = 'hosts',
  monitoringServers = 'monitoring servers',
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
      itemNavigation: ({ id }) => `/main.php?p=60101&o=c&host_id=${id}`,
      title: labelHostsConfiguration
    })
  ],
  [
    equals(GlobalSearchType.services),
    always({
      Icon: SettingsIcon,
      itemNavigation: ({ id }) => `/main.php?p=60201&o=c&service_id=${id}`,
      title: labelServicesConfiguration
    })
  ],
  [
    equals(GlobalSearchType.contacts),
    always({
      Icon: PersonIcon,
      itemNavigation: ({ id }) => `/main.php?p=60301&o=c&contact_id=${id}`,
      title: labelContacts
    })
  ],
  [
    equals(GlobalSearchType.monitoringServers),
    always({
      Icon: DeviceHubIcon,
      itemNavigation: ({ id }) => `/main.php?p=60901&o=c&server_id=${id}`,
      title: labelMonitoringServers
    })
  ]
]);
