import { useContext } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Image, Header, Heading, Box, ResponsiveContext } from 'grommet';
import { useAppState } from '../store';
import { Account } from '../components/Account';
import { SignInButton, LogoutButton } from '../components/buttons/web3Modal';
import { SwitchThemeMode } from './SwitchThemeMode';
import { GlobalMenu, usePageTitle } from './Routes';

export const AppHeader = () => {
  const size = useContext(ResponsiveContext);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { account } = useAppState();
  const title = usePageTitle();
  const returnLocation = (state as any)?.location as Location;

  return (
    <Header
      background='light-1'
      pad={size}
      responsive={true}
    >
      {(returnLocation && account) &&
        <Navigate to={returnLocation} state={null} />
      }
      <Box direction='row' align='center' gap={size}>
        <Image
          src='/wt-logo.png'
          fit='cover'
          width='40rem'
          height='40rem'
          onClick={() => navigate('/')}
        />
        <Heading size='small'>{title}</Heading>
      </Box>
      <Box direction='row' align='center' gap={size}>
        <Account account={account} />
        <Box>
          {account
            ? <LogoutButton />
            : <SignInButton />
          }
        </Box>
        <GlobalMenu />
        <SwitchThemeMode />
      </Box>
    </Header>
  );
};
