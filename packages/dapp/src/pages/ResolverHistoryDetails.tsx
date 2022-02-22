import type { ReactNode } from 'react';
import type { ResolverHistoryRecord } from '../store/actions';
import type { NetworkInfo } from '../config';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Box, Image, Text, NameValueList, NameValuePair, Button, ResponsiveContext } from 'grommet';
import { object } from '@windingtree/org.id-utils';
import { DateTime } from 'luxon';
import { PageWrapper } from '../pages/PageWrapper';
import { useAppState } from '../store';
import { parseDid } from '../hooks/useDidResolver';
import { getRecordById } from '../hooks/useDidResolverHistory';
import { useDownloadObject } from '../hooks/useDownloadObject';
import { MessageBox } from '../components/MessageBox';
import { CopyText } from '../components/CopyText';
import { ExternalLink } from '../components/ExternalLink';
import { centerEllipsis } from '../utils/strings';
import { getNetworkByChainId } from '../config';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('ResolverHistoryDetails');

export interface TopValuesSetProps {
  record: ResolverHistoryRecord;
  size: string;
}

export const imageUri = (uri: string): string => uri.replace('ipfs://', 'https://dweb.link/ipfs/');

export const getOrganizationLogoFromResponse = (record: ResolverHistoryRecord | undefined): string =>
  record
    ? object.getDeepValue(record, 'report.didDocument.legalEntity.media.logo') as string ||
      object.getDeepValue(record, 'report.didDocument.organizationalUnit.media.logo') as string ||
      ''
    : '';

export const getResolutionDate = (record: ResolverHistoryRecord | undefined): string =>
  record
    ? DateTime.fromISO(record.date).toFormat('d LLL yyyy T')
    : 'Unknown';

export const getResolutionDuration = (record: ResolverHistoryRecord | undefined): string =>
  record
    ? `${Number(record.report.didResolutionMetadata.duration) / 1000} sec`
    : 'Unknown';

export const getOrgIdCreation = (record: ResolverHistoryRecord | undefined): string => {
  if (record) {
    const date = object.getDeepValue(record, 'report.didDocumentMetadata.created') as string;

    if (typeof date === 'string') {
      return DateTime.fromISO(date).toFormat('d LLL yyyy T')
    } else {
      return 'Unknown';
    }
  }
  return 'Unknown';
};

export const getOrgIdNft = (record: ResolverHistoryRecord | undefined): string => {
  if (record) {
    const tokenId = object.getDeepValue(record, 'report.didDocumentMetadata.data.tokenId') as string;

    if (typeof tokenId === 'string') {
      return tokenId;
    } else {
      return 'Unknown';
    }
  }
  return 'Unknown';
}

export const getOrgIdOwner = (record: ResolverHistoryRecord | undefined): string => {
  if (record) {
    const owner = object.getDeepValue(record, 'report.didDocumentMetadata.data.owner') as string;

    if (typeof owner === 'string') {
      return owner;
    } else {
      return 'Unknown';
    }
  }
  return 'Unknown';
};

export const getOrganizationType = (record: ResolverHistoryRecord | undefined): string =>
  record
    ? !!object.getDeepValue(record, 'report.didDocument.legalEntity')
      ? 'Legal Entity'
      : !!object.getDeepValue(record, 'report.didDocument.organizationalUnit')
        ? 'Organizational unit'
        : 'Unknown'
    : 'Unknown';

export const getOrgIdNetwork = (record: ResolverHistoryRecord | undefined): NetworkInfo | undefined => {
  const did = record?.did;
  try {
    const { network } = parseDid(did as string);
    const networkConfig = getNetworkByChainId(network);
    return networkConfig;
  }  catch (_) {}
};

export const TopInfoSet = ({ record, size }: TopValuesSetProps) => {
  const network = getOrgIdNetwork(record);
  const owner = getOrgIdOwner(record);
  const tokenId = getOrgIdNft(record);

  const values: Record<string, string | number | ReactNode> = {
    DID: (
      <CopyText
        text={record.did}
        width={15}
        prefixWidth={3}
        size={size}
      />
    ),
    Created: getOrgIdCreation(record),
    Network: network ? `${network.name} (#${network.chainId})` : 'Unknown',
    NFT: (
      <Box direction='row' align='center'>
        {`${tokenId !== 'Unknown' ? '#' + tokenId : tokenId}`}&nbsp;
        <ExternalLink
          href={`${network?.blockExplorer}/address/${network?.address}#code`}
          label='contract'
        />
      </Box>
    ),
    Owner: (
      owner !== 'Unknown'
        ? <ExternalLink
          href={`${network?.blockExplorer}/address/${owner}`}
          label={centerEllipsis(owner)}
        />
        : 'Unknown'
    ),
    Name: record.name,
    Type: getOrganizationType(record)
  };

  return (
    <Box width='auto'>
      <NameValueList>
        {Object.entries(values).map(
          (v, i) => (
            <NameValuePair key={i} name={v[0]}>
              <Text size={size}>{v[1]}</Text>
            </NameValuePair>
          )
        )}
      </NameValueList>
    </Box>
  );
};

export const ResolverHistoryDetails = () => {
  const size = useContext(ResponsiveContext);
  const downloadReport = useDownloadObject();
  const { id } = useParams();
  const { resolverHistory } = useAppState();
  const [recordLoaded, setRecordLoaded] = useState<boolean>(false);
  const [record, setRecord] = useState<ResolverHistoryRecord | undefined>();
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (id !== undefined) {
      const rec = getRecordById(resolverHistory, id);
      logger.debug(`Record #${id}`, rec);
      setRecord(rec);
      setRecordLoaded(true);
    } else {
      setError('Unable to find page route parameter "Id"');
    }
  }, [resolverHistory, id]);

  useEffect(() => {
    if (record === undefined && recordLoaded) {
      setError(`Unable to find resolver history record #${id}`);
    }
  }, [record, id, recordLoaded]);

  return (
    <PageWrapper
      breadcrumbs={[
        {
          path: '/',
          label: 'Home'
        },
        {
          path: '/resolver',
          label: 'Resolutions history'
        }
      ]}
    >
      <MessageBox type='error' show={!!error}>
        <Text size='large'>
          {error}
        </Text>
      </MessageBox>

      {!!record && record.result === 'ERROR' &&
        <Box margin={{
          bottom: size
        }}>
          <MessageBox type='warn' show={true}>
            <Text size='large'>
              This ORGiD DID resolution has been failed
            </Text>
            <Text size='large' color='neutral-2'>
              Failure reason: {record.report.didResolutionMetadata.error}
            </Text>
          </MessageBox>
        </Box>
      }

      {!!record &&
        <Grid
          columns={['1/3', 'auto']}
          gap={size}
        >
          <Box direction='column' gap={size}>
            <Box height="medium" width="auto">
              {/* @todo Create image component with loading indicator */}
              <Image
                fit='cover'
                fallback='/org-default.svg'
                src={
                  imageUri(
                    getOrganizationLogoFromResponse(record)
                  )
                }
              />
            </Box>

            <Box>
              <Text>Resolution date: {getResolutionDate(record)}</Text>
              <Text>Resolution duration: {getResolutionDuration(record)}</Text>
            </Box>

            <Box>
              <Button
                size='large'
                label='Download a raw resolution report'
                onClick={() => downloadReport(record.report, `${record.did}.json`)}
              />
            </Box>
          </Box>
          <Box>
            <TopInfoSet record={record} size={size} />
          </Box>
        </Grid>
      }
    </PageWrapper>
  );
};
