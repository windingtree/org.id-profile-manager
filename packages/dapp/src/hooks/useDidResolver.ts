import type { ORGJSONVCNFT } from '@windingtree/org.json-schema/types/orgVc';
import type {
  ResolverOptions,
  FetcherResolver,
  FetcherConfig,
  DidResolutionResponse
} from '@windingtree/org.id-resolver';
import {
  buildEvmChainConfig,
  buildHttpFetcherConfig,
  OrgIdResolver,
  buildDidResolutionResponse
} from '@windingtree/org.id-resolver';
import { regexp, uid, object } from '@windingtree/org.id-utils';
import { utils as ipfsNodeUtils } from '@windingtree/ipfs-apis';
import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getNetworkByChainId } from '../config';
import { useAppDispatch, useAppState } from '../store';
import { ResolverHistoryRecord } from '../store/actions';

export type UseDidResolverHook = [
  resolve: (did: string) => Promise<string>,
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
    network,
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
  const { resolverHistory } = useAppState();
  const dispatch = useAppDispatch();
  const { ipfsNode } = useAppState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setLoading(false);
  }, [resolverHistory]);

  const resolve = useCallback(
    async (did: string) => {
      const resolutionStart = Date.now();
      const id = uid.simpleUid(8);
      let resolutionResponse: DidResolutionResponse | undefined;

      setLoading(true);

      try {
        if (ipfsNode === undefined) {
          throw new Error('Cannot start DID resolution. IPFS node is not accessible');
        }

        resolutionResponse = await resolveDid(
          did,
          {
            getIpfsResource: (cid: string) =>
              ipfsNodeUtils.getIpfsChunks(ipfsNode.cat(cid))
          }
        );
      } catch (error) {
        setError((error as Error).message || 'Unknown useDidResolver error');
        setLoading(false);
      }

      const record: ResolverHistoryRecord = {
        id,
        name: getOrganizationNameFromResponse(resolutionResponse),
        date: resolutionResponse
          ? resolutionResponse.didResolutionMetadata.retrieved
          : new Date().toISOString(),
        result: resolutionResponse
          ? resolutionResponse.didResolutionMetadata.error
            ? 'ERROR'
            : 'OK'
          : 'ERROR',
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

      dispatch({
        type: 'SET_RECORD',
        payload: {
          name: 'resolverHistory',
          record
        }
      });

      setLoading(false);

      return record.id;
    },
    [dispatch, ipfsNode, error]
  );

  return [resolve, loading, error];
};
