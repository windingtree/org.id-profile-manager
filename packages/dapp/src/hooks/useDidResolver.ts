import type { ORGJSONVCNFT } from '@windingtree/org.json-schema/types/orgVc';
import type {
  ResolverOptions,
  FetcherResolver,
  FetcherConfig,
  DidResolutionResponse
} from '@windingtree/org.id-resolver';
import type { ResolverHistoryRecordRaw } from '../store/actions';
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
import { DidResolutionResult } from './useDidResolverHistory';
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

const resolveDid = async (
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
const getOrganizationNameFromResponse = (
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
    async (did: string): Promise<ResolverHistoryRecordRaw> => {
      setLoading(true);

      const resolutionStart = Date.now();
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
            getIpfsResource: (cid: string) =>
              ipfsNodeUtils.getIpfsChunks(ipfsNode.cat(cid))
          }
        );

        setLoading(false);

        return {
          name: getOrganizationNameFromResponse(resolutionResponse),
          date: resolutionResponse
            ? resolutionResponse.didResolutionMetadata.retrieved
            : new Date().toISOString(),
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
              error
            )
        };
      } catch (error) {
        logger.error(error);
        setError((error as Error).message || 'Unknown useDidResolver error');
        setLoading(false);
        throw error;
      }
    },
    [ipfsNode, error]
  );

  return [resolve, loading, error];
};
