import { useContext } from 'react';
import { Button, Box, Spinner, Text, ResponsiveContext } from 'grommet';
import { Login, Logout } from 'grommet-icons';
import styled from 'styled-components';
import { useAppState } from '../../store';

const InnerSpinner = styled(Spinner)`
  margin-left: 8px;
`;

export const SignInButton = () => {
  const size = useContext(ResponsiveContext);
  const { isConnecting, signIn } = useAppState();

  return (
    <Button
      onClick={() => signIn()}
      disabled={isConnecting}
    >
      {() => (
        <Box direction='row' align='center' pad='small'>
          {size !== 'small' &&
            <Text>
              {isConnecting ? 'Connecting' : 'Connect'}
            </Text>
          }
          {size === 'small' &&
            <Login />
          }
          {isConnecting && <InnerSpinner />}
        </Box>
      )}
    </Button>
  )
};

export const LogoutButton = () => {
  const size = useContext(ResponsiveContext);
  const { isConnecting, logout } = useAppState();

  return (
    <Button
      onClick={() => logout()}
      disabled={isConnecting}
    >
      {() => (
        <Box direction='row' align='center' pad='small'>
          {size !== 'small' &&
            <Text>
              {isConnecting ? 'Connecting' : 'Logout'}
            </Text>
          }
          {size === 'small' &&
            <Logout />
          }
          {isConnecting && <InnerSpinner />}
        </Box>
      )}
    </Button>
  )
};
