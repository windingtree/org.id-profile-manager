import type { ReactNode } from 'react';
import type { Location } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  useRoutes,
  useNavigate,
  useLocation,
  resolvePath
} from 'react-router-dom';
import { Menu } from 'grommet';
import { Menu as MenuIcon } from 'grommet-icons';
import { useAppState } from '../store';
import { Protected } from './Protected';

// Pages
import { Home } from '../pages/Home';
import { Keys } from '../pages/Keys';

export interface RouteConfig {
  path: string;
  element: ReactNode;
  title: string;
  label: string;
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
    path: '/keys',
    element: <Keys />,
    title: 'Keys management',
    label: 'Keys',
    protected: true
  }
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

export const getPageTitle = (location: Location): any => {
  let locationPathname = location.pathname;
  const page = pagesRoutesConfig.find(
    (route => {
      const path = resolvePath(route.path);
      const toPathname = path.pathname;
      return locationPathname === toPathname ||
        (
          locationPathname.startsWith(toPathname) &&
          locationPathname.charAt(toPathname.length) === '/'
        );
    })
  );
  return page?.title || '404';
};

export const usePageTitle = (): string => {
  const location = useLocation();
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(getPageTitle(location));
  }, [location]);

  return title;
};

export const AppRoutes = () => useRoutes(
  processPagesConfig(pagesRoutesConfig)
);

export const GlobalMenu = () => {
  const { isConnecting } = useAppState();
  const navigate = useNavigate();

  const buildMenuConfig = pagesRoutesConfig
    .map(
      (item) => ({
        ...item,
        onClick: () => navigate(item.path)
      })
    );

  return (
    <Menu
      disabled={isConnecting}
      icon={(<MenuIcon />)}
      items={buildMenuConfig}
    />
  );
};
