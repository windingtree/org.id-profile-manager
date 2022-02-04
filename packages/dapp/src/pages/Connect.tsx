import { Box, Text } from 'grommet';

import { useAppState } from '../store';
import { SignInButton, SignOutButton } from '../components/buttons/web3Modal';
import { Account } from '../components/Account';

// Config
import { getNetworksNames } from '../config';

const allowedNetworksNames = getNetworksNames();

export const Connect = () => {
  const { account, isRightNetwork } = useAppState();

  return (
    <Box margin='medium'>
      <Box>
        <Text size='xlarge'>Wallet Connect</Text>
      </Box>
      <Box align="center" justify="center">
        <Account account={account} />
        <div>
          {
            account
              ? <SignOutButton />
              : <SignInButton />
          }
        </div>
        {!isRightNetwork &&
          <Text>
            You are connected to a wrong network. Please switch to one of: {allowedNetworksNames.join(', ')}
          </Text>
        }
      </Box>
    </Box>
  );
};