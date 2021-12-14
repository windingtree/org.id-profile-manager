import { useAppState } from '../../store';
import { Button } from './index';

export const SignInButton = () => {
  const { isConnecting, signIn } = useAppState();

  return (
    <Button
      onClick={() => signIn()}
      disabled={isConnecting}
    >
      Sign-In{isConnecting ? '...' : ''}
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
      Sign-Out{isConnecting ? '...' : ''}
    </Button>
  )
};
