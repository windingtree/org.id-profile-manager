import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Text,
  TextInput,
} from 'grommet';
import { encrypt, decrypt } from '../utils/crypto';
import {useAppState} from "../store";

export const Main = () => {
  const { encryptionKey, dappConfig, switchDappConfig } = useAppState();

  const [value, setValue] = useState({ name: '', email: '' });
  const [cryptoOpInProgress, setCryptoOpInProgress] = useState(false);

  const resetData = () => {
    setValue({ name: '', email: '' });
  };

  const saveData = (nextValue: { name: string, email: string }) => {
    setCryptoOpInProgress(true);

    setTimeout(() => {
      const text = JSON.stringify(nextValue);

      let ciphertext: string;

      try {
        ciphertext = encrypt(text, encryptionKey);
      } catch (e) {
        setCryptoOpInProgress(false);
        return;
      }

      switchDappConfig(ciphertext);
      setCryptoOpInProgress(false);
    }, 100);
  };

  useEffect(() => {
    setCryptoOpInProgress(true);

    setTimeout(() => {
      const ciphertext = dappConfig;

      if (
        (!ciphertext || ciphertext.length === 0) ||
        (!encryptionKey || encryptionKey.length === 0)
      ) {
        setCryptoOpInProgress(false);
        return;
      }

      let text: string;
      try {
        text = decrypt(ciphertext, encryptionKey);
      } catch (e) {
        setCryptoOpInProgress(false);
        return;
      }

      let jsonData: { name: string, email: string };

      try {
        jsonData = JSON.parse(text) as { name: string, email: string };
      } catch (e) {
        setCryptoOpInProgress(false);
        return;
      }

      const name = (jsonData && jsonData.name) ? jsonData.name : '';
      const email = (jsonData && jsonData.email) ? jsonData.email : '';

      setValue({ name, email });
      setCryptoOpInProgress(false);
    }, 100);
  }, [encryptionKey, dappConfig]);

  return (
    <Box margin='medium'>
      <Box>
        <Text size='xlarge'>Main</Text>
      </Box>
      {
        encryptionKey.length === 0 || cryptoOpInProgress === true ?
          <Box align="center" justify="center">
            {
              cryptoOpInProgress === true ?
                <Text size='large'>Cryptographic operation in progress</Text>
                :
                <Text size='large'>Please go to "Settings" page and add an encryption key</Text>
            }
          </Box>
          :
          <Box>
            <Box fill align="center" justify="center">
              <Box width="medium">
                <Form
                  value={value}
                  onChange={nextValue => setValue(nextValue)}
                  onSubmit={({ value: nextValue }) => { saveData(nextValue); }}
                >
                  <FormField label="Name" name="name" required>
                    <TextInput name="name" type="name" />
                  </FormField>

                  <FormField label="Email" name="email" required>
                    <TextInput name="email" type="email" />
                  </FormField>

                  <Box direction="row" justify="between" margin={{ top: 'medium' }}>
                    <Button type="reset" label="Reset" onClick={resetData} />
                    <Button type="submit" label="Save" primary />
                  </Box>
                </Form>
              </Box>
            </Box>
          </Box>
      }
    </Box>
  );
};
