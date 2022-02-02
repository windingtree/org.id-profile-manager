import type { IPFS } from './utils';
import { Web3StorageApi } from './apis/web3Storage';
declare const utils: {
    startIpfsGateway: () => Promise<import("ipfs-core-types/src/").IPFS<{}>>;
    obj2File: (obj: unknown, fileName: string) => File;
};
export { IPFS, Web3StorageApi, utils };
//# sourceMappingURL=index.d.ts.map