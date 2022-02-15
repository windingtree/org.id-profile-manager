import type { VerificationMethodReference } from '@windingtree/org.json-schema/types/org.json';
import type { AnySchema } from '@windingtree/org.id-utils/dist/object';
import type { GenericStateRecord } from '../store';
import { useAppDispatch, useAppState } from '../store';
import { useState, useCallback, useEffect } from 'react';

import { object, uid } from '@windingtree/org.id-utils';
import { org } from '@windingtree/org.json-schema';

export const revocationReasonValues = object.getDeepValue(org, 'definitions.VerificationMethodRevocationReference.properties.reason.enum') as string[];
export type RevocationReference = typeof revocationReasonValues[number]

export const allowedKeysTypes: string[] = ['EcdsaSecp256k1VerificationKey2019'];

export type KeyType =
	typeof allowedKeysTypes[number];

export const keyRecordSchema: AnySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    type: {
      type: 'string',
      enum: allowedKeysTypes
    },
    publicKey: {
      type: 'string'
    },
    tag: {
      type: 'string'
    },
    note: {
      type: 'string'
    },
    revocation: {
      type: 'object',
      properties:{
        reason: {
          type: 'string',
          enum: revocationReasonValues
        },
        invalidityDate: {
          type: 'string',
          format: 'date-time'
        },
      },
      required: ['reason', 'invalidityDate']
    }
  },
  required: ['id', 'type', 'publicKey', 'tag']
}

export interface KeyRecord extends GenericStateRecord {
  type: KeyType;
	publicKey: string; // Ethereum account address
	tag: string; // Unique across records formatted string
	note?: string; // Key description
	revocation?: VerificationMethodReference['verificationMethodRevocation']; // see this type for details
}

export type Keys = KeyRecord[];

export type UseKeysManagerHook = [
  addKey: (record: KeyRecord) => void,
  updateKey: (record: KeyRecord) => void,
  removeKey: (tag: string) => void,
  revokeKey: (tag: string, reason:RevocationReference) => void,
  loading: boolean,
  error: string | undefined,
];

// UseKeysManager react hook
export const useKeysManager = (): UseKeysManagerHook => {
  const { keys } = useAppState();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setLoading(false);
  }, [keys])

  const findKeyById = useCallback((id:string) => (
    keys as Keys).find((key) => key.id === id
  ), [keys]);

  const findKeyByTag = useCallback((tag:string) => (
    keys as Keys).find((key) => key.tag === tag
  ), [keys]);

  const validateKeyWithSchema = (record:KeyRecord) => object.validateWithSchemaOrRef(
    keyRecordSchema,
    '',
    record as KeyRecord
  );

  const addKey = useCallback((record:KeyRecord) => {
    try {
      setLoading(true);
      record = {
        ...record,
        id: uid.simpleUid(8)
      };
      const validationResult = validateKeyWithSchema(record)
      if (validationResult !== null) {
        setLoading(false);
        setError(`Validation error: ${validationResult}`)
        return
      }
      let keyExist = findKeyById(record.id)
      if (keyExist !== undefined) {
        setError('Provided key already exists')
        setLoading(false);
        return 
      }
      let tagExist = findKeyByTag(record.tag)
      if (tagExist !== undefined) {
        setError('Provided tag already used, pick another one')
        setLoading(false);
        return
      }
  
      dispatch({
        type: 'SET_RECORD',
        payload: {
          name: 'keys',
          record
        }
      });
    } catch(error) {
      setError((error as Error).message || 'Unknown useIpfsNode error');
    } 
  }, [findKeyById, findKeyByTag, setLoading, setError, dispatch]);

  const updateKey = useCallback((record:KeyRecord) => {
    try{
      setLoading(true);
      const validationResult = validateKeyWithSchema(record)
      if (validationResult !== null) {
        setLoading(false);
        setError(`Validation error: ${validationResult}`)
        return
      }
      let keyExist = findKeyById(record.id)
      if (keyExist === undefined) {
        setError('Provided key does not have corresponding id')
        setLoading(false);
        return 
      }

      dispatch({
        type: 'SET_RECORD',
        payload: {
          name: 'keys',
          record
        }
      });
    } catch(error) {
      setError((error as Error).message || 'Unknown useIpfsNode error');
    }
  }, [findKeyById, setLoading, setError, dispatch]);

  const removeKey = useCallback((tag:string) => {
    try {
      setLoading(true);
      let keyExist = findKeyByTag(tag)
      if (keyExist === undefined) {
        setError('Key with provided tag does not exist')
        setLoading(false);
        return
      }

      dispatch({
        type: 'REMOVE_RECORD',
        payload: {
          name: 'keys',
          id: keyExist.id
        }
      });
    } catch(error) {
      setError((error as Error).message || 'Unknown useIpfsNode error');
    } 
  }, [findKeyByTag, setLoading, setError, dispatch]);

  const revokeKey = useCallback((tag:string,reason:RevocationReference) => {
    try {
      setLoading(true);
      let keyExist = findKeyByTag(tag)
      if (keyExist === undefined) {
        setError('Key with provided tag does not exist')
        setLoading(false);
        return 
      }
      
      dispatch({
        type: 'SET_RECORD',
        payload: {
          name: 'keys',
          record: {
            ...keyExist,
            revocation: {
              reason,
              invalidityDate: new Date().toISOString()
            }
          }
        }
      });
    } catch(error) {
      setError((error as Error).message || 'Unknown useIpfsNode error');
    }
  }, [dispatch, setLoading,findKeyByTag, setError]);
    
    return [addKey, updateKey, removeKey, revokeKey, loading, error];
  };
  