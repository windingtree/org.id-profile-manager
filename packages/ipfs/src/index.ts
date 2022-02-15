import type { IPFS } from './utils';
import { Web3StorageApi } from './apis/web3Storage';
import { startIpfsGateway, obj2File, getIpfsChunks } from './utils';

const utils = { startIpfsGateway, obj2File, getIpfsChunks };

export { IPFS, Web3StorageApi, utils };
