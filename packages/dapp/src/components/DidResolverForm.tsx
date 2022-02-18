import { useContext, useState, useEffect } from 'react';
import { Box, Form, FormField, TextInput, Button, Spinner, ResponsiveContext } from 'grommet';
import { regexp } from '@windingtree/org.id-utils';
import { useDidResolver } from '../hooks/useDidResolver';
import { MessageBox } from './MessageBox';
import { useAppState } from '../store';

export interface DidResolverFormData {
  did: string;
}

export const validateDid = () => {};

export const defaultResolverForm: DidResolverFormData = {
  did: ''
};

export const DidResolverForm = () => {
  const size = useContext(ResponsiveContext);
  const { ipfsNode, isIpfsNodeConnecting } = useAppState();
  const [resolve, resolverWorking, resolverError] = useDidResolver();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [value, setValue] = useState<DidResolverFormData>(defaultResolverForm);

  useEffect(() => {
    setProcessing(false);
    console.log('###', resolverError);
  }, [resolverError]);

  useEffect(() => {
    setProcessing(resolverWorking);
  }, [resolverWorking]);

  useEffect(() => {
    setError(resolverError);
  }, [resolverError]);

  return (
    <Box direction='column' align='center' justify='center' gap={size}>
      <Form
        validate='blur'
        value={value}
        onChange={nextValue => setValue(nextValue)}
        onReset={() => setValue(defaultResolverForm)}
        onSubmit={async ({ value }) => {
          try {
            const response = await resolve(value.did);
            console.log('@@@@', response);
          } catch (error) {
            console.log('Error', error);
          }
        }}
      >
        <FormField
          name='did'
          htmlFor='text-input-id'
          label='ORGiD DID'
          validate={[
            {
              regexp: regexp.did,
              message: 'Invalid DID format'
            }
          ]}
          disabled={processing}
        >
          <TextInput id='text-input-id' name='did' />
        </FormField>
        <Box direction='row' align='center' gap={size}>
          <Button type='submit' primary label='Resolve' disabled={processing} />
          <Button type='reset' label='Reset' disabled={processing} />
          {processing &&
            <Spinner />
          }
        </Box>
      </Form>
      {(!ipfsNode && !isIpfsNodeConnecting) &&
        <MessageBox type='info' message={'IPFS gateway not initialized yet'} />
      }
      {(!ipfsNode && isIpfsNodeConnecting) &&
        <MessageBox type='info' message={'IPFS gateway not initializing, please wait'} />
      }
      <MessageBox type='error' message={error} />
    </Box>
  );
};
