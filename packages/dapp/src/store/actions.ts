import type { Web3ModalProvider } from '../hooks/useWeb3Modal';
import type { IPFS } from '@windingtree/ipfs-apis';
import type { IProviderInfo } from 'web3modal';
import type { ThemeType } from 'grommet/themes';
import type { VerificationMethodReference } from '@windingtree/org.json-schema/types/org.json';
import type { DidResolutionResponse } from '@windingtree/org.id-resolver';
import { ThemeMode } from '../hooks/useStyle';
import { CurrentPage } from '../hooks/usePageNav';

export interface GenericStateRecord {
  id: string;
  [key: string]: unknown;
}

export interface KeyRecord extends GenericStateRecord {
  type: KeyType;
	publicKey: string; // Ethereum account address
	tag: string; // Unique across records formatted string
	note?: string; // Key description
	revocation?: VerificationMethodReference['verificationMethodRevocation'];
}

export interface KeyRecordRaw extends Omit<KeyRecord, 'id'> {};

export type ResolutionResult =
	| 'OK'
	| 'ERROR';

export interface ResolverHistoryRecord extends GenericStateRecord {
	name: string;
	date: string; // date-time ISO
	result: ResolutionResult;
	report: DidResolutionResponse;
}

export interface ResolverHistoryRecordRaw extends Omit<ResolverHistoryRecord, 'id'> {};

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
  currentPage: CurrentPage;
  switchCurrentPage: Function;
  encryptionAccount: string;
  switchEncryptionAccount: Function;
  encryptionKey: string;
  switchEncryptionKey: Function;
  dappConfig: string;
  switchDappConfig: Function;
  ipfsNode?: IPFS;
  startIpfsNode: Function;
  stopIpfsNode: Function;
  keys: KeyRecord[];
  resolverHistory: ResolverHistoryRecord[];
  [key: string]: unknown | GenericStateRecord[];
}

export interface SetConnectingAction {
  type: 'SET_CONNECTING',
  payload: boolean;
}

export interface SetAccountAction {
  type: 'SET_ACCOUNT',
  payload: string | undefined;
}

export interface SetIsRightNetworkAction {
  type: 'SET_IS_RIGHT_NETWORK',
  payload: boolean;
}

export interface SetNetworkIdAction {
  type: 'SET_NETWORK_ID',
  payload: number | undefined;
}

export interface SetProviderAction {
  type: 'SET_PROVIDER',
  payload: Web3ModalProvider | undefined;
}

export interface SetInjectedProviderAction {
  type: 'SET_INJECTED_PROVIDER',
  payload: IProviderInfo | undefined;
}

export interface SetWeb3modalFunctionsAction {
  type: 'SET_WEB3MODAL_FUNCTIONS',
  payload: {
    signIn: Function;
    signOut: Function;
  }
}

export interface AddErrorAction {
  type: 'ERROR_ADD';
  payload: string;
}

export interface RemoveErrorAction  {
  type: 'ERROR_REMOVE';
  payload: number;
}

export interface RemoveAllErrorsAction {
  type: 'ERROR_REMOVE_ALL';
  payload: number;
}

export interface SetThemeAction {
  type: 'SET_THEME';
  payload: ThemeType;
}

export interface SetThemeModeAction {
  type: 'SET_THEME_MODE';
  payload: ThemeMode;
}

export interface SetSwitchThemeModeAction {
  type: 'SET_SWITCH_THEME_MODE';
  payload: Function;
}

export interface SetCurrentPageAction {
  type: 'SET_CURRENT_PAGE';
  payload: CurrentPage;
}

export interface SetSwitchCurrentPageAction {
  type: 'SET_SWITCH_CURRENT_PAGE';
  payload: Function;
}

export interface SetEncryptionAccountAction {
  type: 'SET_ENCRYPTION_ACCOUNT';
  payload: string;
}

export interface SetSwitchEncryptionAccountAction {
  type: 'SET_SWITCH_ENCRYPTION_ACCOUNT';
  payload: Function;
}

export interface SetEncryptionKeyAction {
  type: 'SET_ENCRYPTION_KEY';
  payload: string;
}

export interface SetSwitchEncryptionKeyAction {
  type: 'SET_SWITCH_ENCRYPTION_KEY';
  payload: Function;
}

export interface SetDappConfigAction {
  type: 'SET_DAPP_CONFIG';
  payload: string;
}

export interface SetSwitchDappConfigAction {
  type: 'SET_SWITCH_DAPP_CONFIG';
  payload: Function;
}

export interface SetIpfsNodeAction {
  type: 'SET_IPFS_NODE';
  payload: {
    ipfsNode: IPFS | undefined;
    startIpfsNode: Function;
    stopIpfsNode: Function;
  }
}

export interface SetRecordAction {
  type: 'SET_RECORD',
  payload: {
    name: string,
    record: GenericStateRecord
  }
}

export interface RemoveRecordAction {
  type: 'REMOVE_RECORD',
  payload: {
    name: string,
    id: string
  }
}

export type Action =
| SetConnectingAction
| SetAccountAction
| SetIsRightNetworkAction
| SetNetworkIdAction
| SetProviderAction
| SetThemeAction
| SetThemeModeAction
| SetSwitchThemeModeAction
| SetCurrentPageAction
| SetSwitchCurrentPageAction
| SetEncryptionAccountAction
| SetSwitchEncryptionAccountAction
| SetEncryptionKeyAction
| SetSwitchEncryptionKeyAction
| SetDappConfigAction
| SetSwitchDappConfigAction
| SetInjectedProviderAction
| SetWeb3modalFunctionsAction
| SetIpfsNodeAction
| SetRecordAction
| RemoveRecordAction
| AddErrorAction
| RemoveErrorAction
| RemoveAllErrorsAction;
