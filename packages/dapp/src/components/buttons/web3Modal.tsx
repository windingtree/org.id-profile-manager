import { Button, Box, Spinner, Text } from 'grommet';
import styled from 'styled-components';

import { useAppState } from '../../store';

const ButtonLabel = styled(Text)`
  margin: 8px;
`;

export const SignInButton = () => {
  const { isConnecting, signIn } = useAppState();

  return (
    <Button
      onClick={() => signIn()}
      disabled={isConnecting}
    >
      {() => (<Box direction="row" align="center">
        <ButtonLabel>Sign-In</ButtonLabel>
        {isConnecting ? <Spinner /> : ''}
      </Box>)}
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
      {() => (<Box direction="row" align="center">
        <ButtonLabel>Sign-Out</ButtonLabel>
        {isConnecting ? <Spinner /> : ''}
      </Box>)}
    </Button>
  )
};
