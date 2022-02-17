import type { ReactNode } from 'react';
import type { Location } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useRoutes, useNavigate, useLocation, resolvePath } from 'react-router-dom';
import { Menu } from 'grommet';
import { Menu as MenuIcon } from 'grommet-icons';
import { useAppState } from '../store';

// Pages
import { Home } from '../pages/Home';
import { Keys } from '../pages/Keys';

export interface PageConfig {
  path: string;
  element: ReactNode;
  title: string;
  label: string;
  protected?: boolean;
}

export const pagesConfig: PageConfig[] = [
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
    label: 'Keys'
  }
];

export const getPageTitle = (location: Location): any => {
  let locationPathname = location.pathname;
  const page = pagesConfig.find(
    (p => {
      const path = resolvePath(p.path);
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

export const AppRoutes = () => useRoutes(pagesConfig);

export const GlobalMenu = () => {
  const { isConnecting } = useAppState();
  const navigate = useNavigate();

  const buildMenuConfig = pagesConfig
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
