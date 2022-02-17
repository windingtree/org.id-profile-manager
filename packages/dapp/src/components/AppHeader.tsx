import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Header, Heading, Box, ResponsiveContext } from 'grommet';
import { useAppState } from '../store';
import { Account } from '../components/Account';
import { SignInButton, SignOutButton } from '../components/buttons/web3Modal';
import { SwitchThemeMode } from './SwitchThemeMode';
import { GlobalMenu, usePageTitle } from './Routes';

export const AppHeader = () => {
  const size = useContext(ResponsiveContext);
  const navigate = useNavigate();
  const { account } = useAppState();
  const title = usePageTitle();

  return (
    <Header
      background='light-1'
      pad={size}
    >
      <Box direction='row' align='center' gap={size}>
        <Avatar src='wt-logo.png' onClick={() => navigate('/')}/>
        <Heading size='small'>{title}</Heading>
      </Box>
      <Box direction='row' align='center' gap={size}>
        <Account account={account} />
        <>
          {account
            ? <SignOutButton />
            : <SignInButton />
          }
        </>
        <GlobalMenu />
        <SwitchThemeMode />
      </Box>
    </Header>
  );
};
