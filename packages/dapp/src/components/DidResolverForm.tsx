import type { ResolverHistoryRecord } from '../store/actions';
import { useContext, useState, useEffect } from 'react';
import { Box, Text, Form, FormField, TextInput,
  Button, Spinner, ResponsiveContext } from 'grommet';
import { useNavigate } from 'react-router-dom';
import { regexp } from '@windingtree/org.id-utils';
import { useDidResolver } from '../hooks/useDidResolver';
import { useDidResolverHistory } from '../hooks/useDidResolverHistory';
import { MessageBox } from './MessageBox';
import { useAppState } from '../store';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('DidResolverForm');

export interface DidResolverFormData {
  did: string;
}

export const defaultResolverForm: DidResolverFormData = {
  did: ''
};

export const DidResolverForm = () => {
  const size = useContext(ResponsiveContext);
  const navigate = useNavigate();
  const { ipfsNode, isIpfsNodeConnecting } = useAppState();
  const [resolve, resolverWorking, resolverError] = useDidResolver();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addHistoryRecord, _, historyLoading, historyError] = useDidResolverHistory();
  const [processing, setProcessing] = useState(false);
  const [value, setValue] = useState<DidResolverFormData>(defaultResolverForm);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setProcessing(false);
  }, [resolverError]);

  useEffect(() => {
    setProcessing(resolverWorking);
  }, [resolverWorking]);

  return (
    <Box
      direction='column'
      justify='center'
      fill='horizontal'
      gap={size}
      pad={{
        horizontal: '20%'
      }}
      width={{
        min: '350px'
      }}
    >
      <Form
        validate='blur'
        value={value}
        onChange={nextValue => setValue(nextValue)}
        onReset={() => setValue(defaultResolverForm)}
        onSubmit={async ({ value }) => {
          try {
            const response = await resolve(value.did);
            logger.debug(response);

            let historyRecordId: string | undefined;

            if (response.id === undefined) {
              // New report
              historyRecordId = addHistoryRecord(response);
            } else {
              historyRecordId = (response as ResolverHistoryRecord).id;
            }

            logger.debug('historyRecordId', historyRecordId);

            if (historyRecordId !== undefined) {
              navigate(`/resolver/${historyRecordId}`);
            }
          } catch (err) {
            logger.error(err);
            setError((err as Error).message || 'Unknown ORGiD resolution error')
          }
        }}
      >
        <FormField
          name='did'
          htmlFor='text-input-id'
          label={<Text size='large' weight='bold'>ORGiD DID</Text>}
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
          <Button size='large' type='submit' primary label='Resolve' disabled={processing || !!!ipfsNode} />
          <Button size='large' type='reset' label='Reset' disabled={processing} />
          {processing &&
            <Spinner />
          }
        </Box>
      </Form>
      <MessageBox show={!ipfsNode && !isIpfsNodeConnecting} type='warn'>
        <Text>
          IPFS gateway not initialized
        </Text>
      </MessageBox>
      <MessageBox show={!ipfsNode && isIpfsNodeConnecting} type='info'>
        <Box direction='row' gap='small'>
          <Text>IPFS gateway is initializing, please wait</Text>
          <Spinner />
        </Box>
      </MessageBox>
      <MessageBox show={!!error} type='error'>
        <Text>
          {error}
        </Text>
      </MessageBox>
      <MessageBox show={!!resolverError} type='error'>
        <Text>
          {resolverError}
        </Text>
      </MessageBox>
      <MessageBox show={!!historyError} type='error'>
        <Text>
          {historyError}
        </Text>
      </MessageBox>
    </Box>
  );
};
