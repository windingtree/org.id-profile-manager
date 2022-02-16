import type { IPFS, Options as IpfsOptions } from '@windingtree/ipfs-apis';
import { useState, useCallback, useEffect } from 'react';
import { utils } from '@windingtree/ipfs-apis';

export type UseIpfsNode = [
  node: IPFS | undefined,
  start: Function,
  stop: Function,
  loading: boolean,
  error: string | undefined,
];

// useIpfsNode react hook
export const useIpfsNode = (silent = false): UseIpfsNode => {
  const [node, setNode] = useState<IPFS | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const start = useCallback(async (options?: IpfsOptions): Promise<IPFS | undefined> => {
    try {
      setLoading(true);
      const ipfsNode = await utils.startIpfsGateway(options);
      setNode(ipfsNode);
      setLoading(false);
      return ipfsNode;
    } catch (e) {
      setError((e as Error).message || 'Unknown useIpfsNode error');
      setLoading(false);
    }
  }, []);

  const doStop = async (ipfsNodePromise: Promise<IPFS | undefined>): Promise<void> => {
    const ipfsNode = await (ipfsNodePromise || Promise.resolve());

    if (ipfsNode !== undefined) {
      await ipfsNode.stop();
    }
  }

  const stop = useCallback(async (): Promise<void> => {
    if (node !== undefined) {
      try {
        setLoading(true);
        await doStop(Promise.resolve(node));
        setNode(undefined);
        setLoading(false);
      } catch (e) {
        setError((e as Error).message || 'Unknown useIpfsNode error');
        setLoading(false);
      }
    }
  }, [node]);

  useEffect(() => {
    if (!silent) {
      const ipfsNodePromise = start({
        preload: {
          addresses: [
            '/dns4/node0.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
            '/dns4/node1.preload.ipfs.io/tcp/443/wss/p2p/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
            '/dns4/node2.preload.ipfs.io/tcp/443/wss/p2p/QmV7gnbW5VTcJ3oyM2Xk1rdFBJ3kTkvxc87UFGsun29STS',
            '/dns4/node3.preload.ipfs.io/tcp/443/wss/p2p/QmY7JB6MQXhxHvq7dBDh4HpbH29v4yE9JRadAVpndvzySN'
          ]
        }
      });
      return () => {
        doStop(ipfsNodePromise);
      };
    }

  }, [silent, start]);

  return [node, start, stop, loading, error];
};
