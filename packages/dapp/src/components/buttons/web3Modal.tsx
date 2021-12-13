import { useAppState } from '../../store';

export const SignInButton = () => {
  const { isConnecting, signIn } = useAppState();

  return (
    <button
      onClick={() => signIn()}
      disabled={isConnecting}
    >
      Sign-In{isConnecting ? '...' : ''}
    </button>
  )
};

export const SignOutButton = () => {
  const { isConnecting, signOut } = useAppState();

  return (
    <button
      onClick={() => signOut()}
      disabled={isConnecting}
    >
      Sign-Out{isConnecting ? '...' : ''}
    </button>
  )
};
