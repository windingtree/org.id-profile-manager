import type { ORGJSONVCNFT } from '@windingtree/org.json-schema/types/orgVc';
import type {
  ResolverOptions,
  FetcherResolver,
  FetcherConfig,
  DidResolutionResponse
} from '@windingtree/org.id-resolver';
import type { IPFS } from '@windingtree/ipfs-apis';
import type {
  ResolverHistoryRecordRaw,
  ResolverHistoryRecord
} from '../store/actions';
import {
  buildEvmChainConfig,
  buildHttpFetcherConfig,
  OrgIdResolver,
  buildDidResolutionResponse
} from '@windingtree/org.id-resolver';
import { regexp, object } from '@windingtree/org.id-utils';
import { utils as ipfsNodeUtils } from '@windingtree/ipfs-apis';
import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getNetworkByChainId } from '../config';
import { useAppState } from '../store';
import { DidResolutionResult, getRecordByDid } from './useDidResolverHistory';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useDidResolver');

export type UseDidResolverHook = [
  resolve: (did: string) => Promise<ResolverHistoryRecordRaw>,
  loading: boolean,
  error: string | undefined,
];

export interface ParsedDid {
  did: string;
  method: string;
  network: number;
  orgId: string;
  query?: string;
  fragment?: string;
}

export interface DidGroupedCheckResult extends RegExpExecArray {
  groups: {
    did: string;
    method: string;
    network?: string;
    id: string;
    query?: string;
    fragment?: string;
  }
}

export interface DidResolverOptions {
  getIpfsResource: (cid: string) => Promise<unknown>;
}

const UNKNOWN_ORGID = 'Unknown organization';

export const ipfsCidResolver = (ipfsNode: IPFS) => async (cid: string) => {
  try {
    const rawResource = await Promise.race([
      ipfsNodeUtils.getIpfsChunks(ipfsNode.cat(cid)),
      new Promise(
        (_, reject) => setTimeout(
          () => reject(new Error(`Timeout occurred during getting cid: ${cid}`)),
          70000 // @todo Move timeout value to the Dapp configuration
        )
      )
    ]) as string;

    try {
      return JSON.parse(rawResource);
    } catch (error) {
      throw new Error(`Unable to parse ORGiD VC from the CID: ${cid}`);
    }
  } catch (error) {
    logger.debug('ipfsCidResolver', error);
    throw error;
  }
};

// @todo Move this helper to the SDK utility
export const parseDid = (did: string): ParsedDid => {
  const groupedCheck = regexp.didGrouped.exec(did) as DidGroupedCheckResult;

  if (!groupedCheck || !groupedCheck.groups || !groupedCheck.groups.did) {
    throw new Error(`Invalid DID format: ${did}`);
  }

  const {
    method,
    network,
    id,
    query,
    fragment
  } = groupedCheck.groups;

  return {
    did,
    method,
    network: Number(network) || 1, // Mainnet is default value
    orgId: id,
    query,
    fragment
  };
};

export const resolveDid = async (
  did: string,
  {
    getIpfsResource
  }: DidResolverOptions
): Promise<DidResolutionResponse> => {
  const { network } = parseDid(did);
  const { address, rpc } = getNetworkByChainId(network);
  const provider = new ethers.providers.JsonRpcProvider(rpc);

  const chainConfig = buildEvmChainConfig(
    String(network),
    'eip155',
    address,
    provider
  );

  const ipfsFetcherInitializer = (): FetcherResolver => ({
    getOrgJson: async (uri: string): Promise<ORGJSONVCNFT> =>
      getIpfsResource(uri) as Promise<ORGJSONVCNFT>
  });

  const buildIpfsFetcherConfig = (): FetcherConfig => ({
    id: 'ipfs',
    name: 'ORG.JSON IPFS fetcher',
    init: ipfsFetcherInitializer
  });

  const resolverOptions: ResolverOptions = {
    chains: [
      chainConfig
    ],
    fetchers: [
      buildHttpFetcherConfig(),
      buildIpfsFetcherConfig()
    ]
  };

  const resolver = OrgIdResolver(resolverOptions);
  return resolver.resolve(did);
};

// @todo Improve typings for object.getDeepValue
export const getOrganizationNameFromResponse = (
  response: {} | undefined
): string => {
  if (response === undefined) {
    return UNKNOWN_ORGID;
  }

  return object.getDeepValue(response, 'didDocument.legalEntity.legalName') as string ||
    object.getDeepValue(response, 'didDocument.organizationalUnit.name') as string ||
    UNKNOWN_ORGID;
}

// useDidResolver react hook
export const useDidResolver = (): UseDidResolverHook => {
  const { resolverHistory, ipfsNode } = useAppState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setLoading(false);
  }, [resolverHistory]);

  const resolve = useCallback(
    async (did: string): Promise<ResolverHistoryRecordRaw | ResolverHistoryRecord> => {
      setLoading(true);

      // Try to get result from history
      const existedResult = getRecordByDid(resolverHistory, did);
      logger.debug('existedResult', existedResult);

      if (!!existedResult && existedResult.result !== 'ERROR') {
        // @todo Implement resolution history record expiration check
        setLoading(false);
        return existedResult;
      }

      const resolutionStart = Date.now();
      let resolveDidError: string | undefined;
      let resolutionResponse: DidResolutionResponse | undefined;

      try {
        if (ipfsNode === undefined) {
          throw new Error(
            'Cannot start DID resolution. IPFS node is not accessible'
          );
        }

        resolutionResponse = await resolveDid(
          did,
          {
            getIpfsResource: ipfsCidResolver(ipfsNode)
          }
        );
      } catch (err) {
        logger.error(err);
        resolveDidError = (err as Error).message || 'Unknown useDidResolver error';
        setError(resolveDidError);
      }

      // Creating of a raw history record
      const newHistoryRecord = {
        name: getOrganizationNameFromResponse(resolutionResponse),
        date: resolutionResponse
          ? resolutionResponse.didResolutionMetadata.retrieved
          : new Date().toISOString(),
        did,
        result: resolutionResponse
          ? resolutionResponse.didResolutionMetadata.error
            ? DidResolutionResult.Error
            : DidResolutionResult.Ok
          : DidResolutionResult.Error,
        report: resolutionResponse
          ? resolutionResponse
          : buildDidResolutionResponse( // If resolution failed
            did,
            resolutionStart,
            undefined,
            undefined,
            resolveDidError
          )
      };

      setLoading(false);
      logger.debug('newHistoryRecord', newHistoryRecord);
      return newHistoryRecord;
    },
    [ipfsNode, resolverHistory]
  );

  return [resolve, loading, error];
};
