import { Box, Button, Text } from 'grommet';
import {useAppState} from "../store";

function maskCharacters(str: string, mask: string, n: number = 1) {
  // Slice the string and replace with mask, then add remaining string
  return ('' + str).slice(0, -n).replace(/./g, mask) + ('' + str).slice(-n);
}

export const Settings = () => {
  const { account, encryptionAccount, switchEncryptionAccount, encryptionKey, switchEncryptionKey } = useAppState();

  async function getAccounts () {
    const provider = window.ethereum;

    const accounts = await provider.enable();

    switchEncryptionAccount(accounts[0]);
    switchEncryptionKey('');
  }

  async function getPublicKey () {
    const provider = window.ethereum;

    const encryptionPublicKey = await provider.request({
      method: 'eth_getEncryptionPublicKey',
      params: [encryptionAccount],
    });

    switchEncryptionKey(encryptionPublicKey);
  }

  return (
    <Box margin='medium'>
      <Box>
        <Text size='xlarge'>Settings</Text>
        {
          !account || account.length === 0 ?
            <Box align="center" justify="center">
              <Text size='large'>Please go to "Wallet Connect" page and connect your wallet</Text>
            </Box>
            :
            <Box align='center' pad='medium'>
              <Button primary disabled={encryptionAccount.length > 0} label='Get Encryption Account' onClick={async () => { await getAccounts(); }} />
              {
                encryptionAccount.length === 0 ? null
                  :
                  <Text size='medium'>Encryption Account - '{encryptionAccount}'</Text>
              }
            </Box>
        }
        {
          !account || account.length === 0 || encryptionAccount.length === 0 ? null
            :
            <Box align='center' pad='medium'>
              <Button primary disabled={encryptionKey.length > 0} label='Get Encryption Key' onClick={async () => { await getPublicKey(); }} />
              {
                encryptionKey.length === 0 ? null
                  :
                  <Text size='medium'>Encryption Key - '{maskCharacters(encryptionKey, '*', 4)}'</Text>
              }
            </Box>
        }
      </Box>
    </Box>
  );
};
