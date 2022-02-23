import type { ReactNode } from 'react';
import type { ResolutionResult, ResolverHistoryRecord } from '../store/actions';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Text, Anchor, Spinner, ResponsiveContext } from 'grommet';
import { Trash } from 'grommet-icons';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { useAppState } from '../store';
import { PageWrapper } from '../pages/PageWrapper';
import { MessageBox } from '../components/MessageBox';
import { Confirmation } from '../components/Confirmation';
import { CopyText } from '../components/CopyText';
import { useDidResolverHistory } from '../hooks/useDidResolverHistory';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('ResolverHistory');

export type SortType =
  | 'asc'
  | 'desc';

export const parseResolutionResult = (result: ResolutionResult): ReactNode => (
  <Text color={
    result === 'ERROR' ? 'status-error' : 'status-ok'
  }>{result}</Text>
);

export const TrashIcon = styled(Trash)`
  cursor: pointer;
`;

export const ResolverHistory = () => {
  const size = useContext(ResponsiveContext);
  const navigate = useNavigate();
  const { resolverHistory } = useAppState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, removeRecord, historyLoading, historyError] = useDidResolverHistory();
  const [selectedRecord, setSelectedRecord] = useState<string | undefined>();

  useEffect(() => {
    setSelectedRecord(undefined);
  }, [resolverHistory]);

  const sortRecordsByDate = (
    records: ResolverHistoryRecord[],
    type: SortType
  ): ResolverHistoryRecord[] => records.sort(
    (a, b) =>
      type === 'asc'
        ? DateTime.fromISO(a.date) > DateTime.fromISO(b.date) ? 1 : -1
        : DateTime.fromISO(a.date) < DateTime.fromISO(b.date) ? 1 : -1
  );

  return (
    <PageWrapper
      breadcrumbs={[
        {
          path: '/',
          label: 'Home'
        }
      ]}
    >
      <Box>
        <Grid
          fill='horizontal'
          responsive
          pad='small'
          border='bottom'
          columns={['12rem', '10rem', 'flex', 'small', 'xsmall']}
          align='center'
        >
          <Text size={size} weight='bold'>Organization</Text>
          <Text size={size} weight='bold'>Query date</Text>
          <Text size={size} weight='bold'>DID</Text>
          <Text size={size} weight='bold'>Result</Text>
          <Text size={size} weight='bold'></Text>
        </Grid>
        {sortRecordsByDate(resolverHistory, 'desc').map(
          (record, i) => (
            <Grid
              fill='horizontal'
              responsive
              pad='small'
              key={i}
              border='bottom'
              columns={['12rem', '10rem', 'flex', 'small', 'xsmall']}
              align='center'
            >
              <Text size={size}>
                <Anchor
                  label={record.name}
                  onClick={() => navigate(`/resolver/${record.id}`)}
                />
              </Text>
              <Text size={size}>{DateTime.fromISO(record.date).toLocaleString(DateTime.DATETIME_SHORT)}</Text>
              <Text size={size}>
                <CopyText
                  text={record.did}
                  width={15}
                  prefixWidth={3}
                  size={size}
                />
              </Text>
              {parseResolutionResult(record.result)}
              {historyLoading
                ? <Spinner size='small' />
                : <TrashIcon size='small' onClick={() => setSelectedRecord(record.id)} />
              }
            </Grid>
          )
        )}
        <Confirmation
          show={selectedRecord !== undefined}
          title='Removal confirmation'
          message={`Are you sure you want to remove the record #${selectedRecord}? This operation cannot be undone`}
          onCancel={() => {
            logger.debug(`Removal request cancelled, record #${selectedRecord}`);
            setSelectedRecord(undefined);
          }}
          onConfirm={() => {
            logger.debug(`Removal request, record #${selectedRecord}`);
            removeRecord(selectedRecord as string);
          }}
        />
      </Box>

      <Box>
        <MessageBox show={!!historyError} type='error'>
          <Text>
            {historyError}
          </Text>
        </MessageBox>
      </Box>
    </PageWrapper>
  );
};
