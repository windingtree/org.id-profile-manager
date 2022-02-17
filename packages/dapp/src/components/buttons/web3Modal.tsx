import { Button, Box, Spinner, Text } from 'grommet';
import styled from 'styled-components';
import { useAppState } from '../../store';

const InnerSpinner = styled(Spinner)`
  margin-left: 8px;
`;

export const SignInButton = () => {
  const { isConnecting, signIn } = useAppState();

  return (
    <Button
      onClick={() => signIn()}
      disabled={isConnecting}
    >
      {() => (
        <Box direction='row' align='center' pad='small'>
          <Text>
          {isConnecting ? 'Connecting' : 'Connect'}
          </Text>
          {isConnecting && <InnerSpinner />}
        </Box>
      )}
    </Button>
  )
};

export const SignOutButton = () => {
  const { isConnecting, signOut } = useAppState();

  return (
    <Button
      onClick={() => signOut()}
      disabled={isConnecting}
    >
      {() => (
        <Box direction='row' align='center' pad='small'>
          <Text>
            {isConnecting ? 'Connecting' : 'Disconnect'}
          </Text>
          {isConnecting && <InnerSpinner />}
        </Box>
      )}
    </Button>
  )
};
