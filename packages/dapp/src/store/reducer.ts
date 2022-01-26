import type { Web3ModalProvider } from '../hooks/useWeb3Modal';
import type { IProviderInfo } from 'web3modal';
import type { Action } from './actions';
import type { ThemeType } from 'grommet/themes';
import { useReducer } from 'react';
import Logger from '../utils/logger';
import { ThemeMode } from '../hooks/useStyle';

// Initialize logger
const logger = Logger('Reducer');

export interface State {
  isConnecting: boolean;
  networkId?: number;
  isRightNetwork: boolean;
  provider?: Web3ModalProvider;
  injectedProvider?: IProviderInfo;
  account?: string;
  signIn: Function;
  signOut: Function;
  errors: string[];
  theme?: ThemeType;
  themeMode: ThemeMode; 
  switchThemeMode: Function;
}

export const reducer = (state: State, action: Action): State => {
  logger.debug('Dispatch', action);
  const type = action.type;
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
};

const initialState: State = {
  isConnecting: false,
  isRightNetwork: true,
  signIn: () => {},
  signOut: () => {},
  errors: [],
  themeMode:ThemeMode.light,
  switchThemeMode: () => {}
};

export const useAppReducer = () => useReducer(reducer, initialState);
