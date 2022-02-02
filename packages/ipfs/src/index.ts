import type { IPFS } from './utils';
import { Web3StorageApi } from './apis/web3Storage';
import { startIpfsGateway, obj2File } from './utils';

const utils = { startIpfsGateway, obj2File };

export { IPFS, Web3StorageApi, utils };
