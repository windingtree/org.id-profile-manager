import { useState, useCallback, useEffect } from 'react';
import type { VerificationMethodReference } from '@windingtree/org.json-schema/types/org.json';

export const allowedKeysTypes: string[] =
	['EcdsaSecp256k1VerificationKey2019'] as const;

export type KeyType =
	typeof allowedKeysTypes[number];

export interface KeyRecord {
	id: string; // Unique Id generated using `simpleUid()` 
							// from @windingtree/org.id-utils package. 
							// For example see the docs: 
							// https://windingtree.github.io/org.id-sdk/#/build/utils/index?id=simpleuidlength
	type: KeyType;
	publicKey: string; // Ethereum account address
	tag: string; // Unique across records formatted string
	node: string; // Key description
	revocation: VerificationMethodReference['verificationMethodRevocation']; // see this type for details
}

export type Keys = KeyRecord[];

export type UseKeysManager = [
  keys: Keys,
  addKey: Function,
  updateKey: Function,
  removeKey: Function,
  revokeKey: Function,
  loading: boolean,
  error: string | undefined,
];

// UseKeysManager react hook
export const useKeysManager = (
  // encryptionKey:string
): UseKeysManager => {
  const [keys, setKeys] = useState<Keys>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const addKey = useCallback(async (record:KeyRecord) => {
    setLoading(true);
    let keyExist = keys.find((key) => key.id == record.id)
    if (keyExist !== undefined) {
      setError('Provided key already exists')
      setLoading(false);
      return 
    }

    setKeys([...keys,record]);
    setLoading(false);
  }, [keys]);

  const updateKey = useCallback(async (record:KeyRecord) => {
    setLoading(true);
    let keyExist = keys.find((key) => key.id == record.id)
    if (keyExist === undefined) {
      setError('Provided key does not exist')
      setLoading(false);
      return 
    }

    let newKeys = keys.filter((key) => key.id !== record.id)
    setKeys([...newKeys,record]);
    setLoading(false);
  }, [keys]);

  const removeKey = useCallback(async (id:string) => {
    setLoading(true);
    let keyExist = keys.find((key) => key.id == id)
    if (keyExist === undefined) {
      setError('Provided key does not exist')
      setLoading(false);
      return 
    }

    let newKeys = keys.filter((key) => key.id !== id)
    setKeys(newKeys);
    setLoading(false);
  }, [keys]);

  const revokeKey = useCallback(async (id:string) => {
    setLoading(true);
    setLoading(false);
  }, []);

  // useEffect(() => {

  // }, []);


  return [keys, addKey, updateKey, removeKey, revokeKey, loading, error];
};
