import { useAppState } from '../store';
import { SignInButton, SignOutButton } from '../components/buttons/web3Modal';
import { Account } from '../components/Account';

// Config
import { getNetworksNames } from '../config';

const allowedNetworksNames = getNetworksNames();

export const Main = () => {
  const { account, isRightNetwork } = useAppState();

  return (
    <div>
      <div>Main</div>
      <div>
        <Account account={account} />
      </div>
      <div>
        {
          account
            ? <SignOutButton />
            : <SignInButton />
        }
      </div>
      {!isRightNetwork &&
        <div>
          You are connected to a wrong network. Please switch to one of: {allowedNetworksNames.join(', ')}
        </div>
      }

    </div>
  );
};
