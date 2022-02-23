import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useRoutes, useNavigate } from 'react-router-dom';
import { Menu } from 'grommet';
import { Menu as MenuIcon } from 'grommet-icons';
import { useAppState } from '../store';
import { Protected } from './Protected';

// Pages
import { Home } from '../pages/Home';
import { Keys } from '../pages/Keys';
import { ResolverHistory } from '../pages/ResolverHistory';
import { ResolverHistoryDetails } from '../pages/ResolverHistoryDetails';

export interface RouteConfig {
  path: string;
  element: ReactNode;
  title: string;
  label?: string;
  protected?: boolean;
}

export type Routes = RouteConfig[];

export const pagesRoutesConfig: Routes = [
  {
    path: '/',
    element: <Home />,
    title: 'Home',
    label: 'Home'
  },
  {
    path: '/resolver',
    element: <ResolverHistory />,
    title: 'DID resolutions history',
    label: 'DID resolutions',
  },
  {
    path: '/keys',
    element: <Keys />,
    title: 'Keys management',
    label: 'Keys',
    protected: true
  },
  {
    path: '/resolver/:id',
    element: <ResolverHistoryDetails />,
    title: 'DID resolution report'
  },
];

export const processPagesConfig = (config: Routes): Routes =>
  config.map(
    (route: RouteConfig) => route.protected
      ? {
        ...route,
        element: <Protected component={route.element} />
      }
      : route
  );

export const AppRoutes = () => useRoutes(
  useMemo(
    () => processPagesConfig(pagesRoutesConfig), []
  )
);

export const GlobalMenu = () => {
  const { isConnecting } = useAppState();
  const navigate = useNavigate();
  const buildMenuConfig = useMemo(
    () => pagesRoutesConfig
      .reduce<Routes>(
        (a, v) => ([
          ...a,
          ...(
            v.label // Items without labels are ignored
              ? [
                {
                  ...v,
                  onClick: () => navigate(v.path)
                }
              ]
              : []
          )
        ]),
        []
      ),
    [navigate]
  );

  return (
    <Menu
      disabled={isConnecting}
      icon={(<MenuIcon />)}
      items={buildMenuConfig}
    />
  );
};
