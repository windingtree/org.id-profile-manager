import type { Action, State, GenericStateRecord } from './actions';
import { useReducer } from 'react';
import Logger from '../utils/logger';
import { ThemeMode } from '../hooks/useStyle';
import { CurrentPage } from '../hooks/usePageNav';

// Initialize logger
const logger = Logger('Reducer');

export const reducer = (state: State, action: Action): State => {
  logger.debug('Dispatch', action);
  let records: GenericStateRecord[];
  const type = action.type;

  try {
    switch (type) {
      case 'SET_CONNECTING':
        return {
          ...state,
          isConnecting: action.payload
        };
      case 'SET_ACCOUNT':
        return {
          ...state,
          account: action.payload
        };
      case 'SET_IS_RIGHT_NETWORK':
        return {
          ...state,
          isRightNetwork: action.payload
        };
      case 'SET_THEME':
        return {
          ...state,
          theme: action.payload
        };
      case 'SET_THEME_MODE':
        return {
          ...state,
          themeMode: action.payload
        };
      case 'SET_SWITCH_THEME_MODE':
        return {
          ...state,
          switchThemeMode: action.payload
        };
      case 'SET_CURRENT_PAGE':
        return {
          ...state,
          currentPage: action.payload
        }
      case 'SET_SWITCH_CURRENT_PAGE':
        return {
          ...state,
          switchCurrentPage: action.payload
        };
      case 'SET_ENCRYPTION_ACCOUNT':
        return {
          ...state,
          encryptionAccount: action.payload
        }
      case 'SET_SWITCH_ENCRYPTION_ACCOUNT':
        return {
          ...state,
          switchEncryptionAccount: action.payload
        };
      case 'SET_ENCRYPTION_KEY':
        return {
          ...state,
          encryptionKey: action.payload
        }
      case 'SET_SWITCH_ENCRYPTION_KEY':
        return {
          ...state,
          switchEncryptionKey: action.payload
        };
      case 'SET_DAPP_CONFIG':
        return {
          ...state,
          dappConfig: action.payload
        }
      case 'SET_SWITCH_DAPP_CONFIG':
        return {
          ...state,
          switchDappConfig: action.payload
        };
      case 'SET_NETWORK_ID':
        return {
          ...state,
          networkId: action.payload
        };
      case 'SET_PROVIDER':
        return {
          ...state,
          provider: action.payload
        };
      case 'SET_INJECTED_PROVIDER':
        return {
          ...state,
          injectedProvider: action.payload
        };
      case 'SET_WEB3MODAL_FUNCTIONS':
        return {
          ...state,
          signIn: action.payload.signIn,
          signOut: action.payload.signOut
        };
      case 'SET_IPFS_NODE':
        return {
          ...state,
          ipfsNode: action.payload.ipfsNode,
          startIpfsNode: action.payload.startIpfsNode,
          stopIpfsNode: action.payload.stopIpfsNode
        };
      case 'SET_RECORD':
        if (!action.payload.name) {
          throw new Error(`State record name must be provided with a payload`);
        }
        if (typeof action.payload.record !== 'object') {
          throw new Error(`State record name must be provided with a payload`);
        }
        if (!action.payload.record.id) {
          throw new Error(`State record name must have Id property defined`);
        }
        // Add or update a record
        records = state[action.payload.name] as GenericStateRecord[];
        const knownRecord = records.filter(
          (r: GenericStateRecord) => r.id === action.payload.record.id
        )[0] || {};
        const restRecords = records.filter(
          (r: GenericStateRecord) => r.id !== action.payload.record.id
        );
        return {
          ...state,
          [action.payload.name]: [
            ...restRecords,
            ...[
              {
                ...knownRecord,
                ...action.payload.record
              }
            ]
          ]
        };
      case 'REMOVE_RECORD':
        if (!action.payload.name) {
          throw new Error(`State record name must be provided with a payload`);
        }
        if (!action.payload.id) {
          throw new Error(`State record Id must be provided with a payload`);
        }
        // Remove record
        records = state[action.payload.name] as GenericStateRecord[];
        return {
          ...state,
          [action.payload.name]: records.filter(
            (r: GenericStateRecord) => r.id !== action.payload.id
          )
        };
      case 'ERROR_ADD':
        return {
          ...state,
          errors: [
            ...state.errors,
            action.payload
          ]
        };
      case 'ERROR_REMOVE':
        return {
          ...state,
          errors: state.errors.filter((e, i) => i !== action.payload)
        };
      case 'ERROR_REMOVE_ALL':
        return {
          ...state,
          errors: []
        };
      default:
        throw new Error(`Unknown state action type: ${type}`);
    }
  } catch(error) {
    logger.error((error as Error).message || 'Unknown state reducer error');
    return state;
  }
};

const initialState: State = {
  isConnecting: false,
  isRightNetwork: true,
  signIn: () => {},
  signOut: () => {},
  errors: [],
  themeMode:ThemeMode.light,
  switchThemeMode: () => {},
  currentPage: CurrentPage.home,
  switchCurrentPage: () => {},
  encryptionAccount: "",
  switchEncryptionAccount: () => {},
  encryptionKey: "",
  switchEncryptionKey: () => {},
  dappConfig: "",
  switchDappConfig: () => {},
  startIpfsNode: () => {},
  stopIpfsNode: () => {},
  keys: [],
  resolverHistory: []
};

export const useAppReducer = () => useReducer(reducer, initialState);
