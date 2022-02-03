"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3StorageApi = void 0;
const base_1 = require("./base");
const utils_1 = require("../utils");
const org_id_utils_1 = require("@windingtree/org.id-utils");
const web3StorageApiPath = 'https://api.web3.storage';
class Web3StorageApi extends base_1.BaseIpfsStorageApi {
    authToken;
    ipfsGateway;
    constructor(token, gateway) {
        super();
        if (!token) {
            throw new Error('Web3Storage Authorization API token must be provided');
        }
        if (!gateway) {
            throw new Error('IPFS gateway must be provided');
        }
        this.authToken = token;
        this.ipfsGateway = gateway;
    }
    authHeader() {
        return {
            'Authorization': `Bearer ${this.authToken}`,
            'X-Client': 'web3.storage/js'
        };
    }
    async add(file) {
        return org_id_utils_1.http.request(`${web3StorageApiPath}/upload`, 'POST', await file.arrayBuffer(), {
            ...this.authHeader(),
            'X-NAME': file.name
        });
    }
    async get(cid) {
        return (0, utils_1.getIpfsChunks)(this.ipfsGateway.cat(cid));
    }
    // Faked until Web3.storage not implemented /user/uploads/{cid}
    // https://github.com/web3-storage/web3.storage/issues/314
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete(cid) {
        return Promise.resolve();
    }
    async _delete(cid) {
        await org_id_utils_1.http.request(`${web3StorageApiPath}/user/uploads/${cid}`, 'DELETE', undefined, {
            ...this.authHeader()
        });
    }
}
exports.Web3StorageApi = Web3StorageApi;
//# sourceMappingURL=web3Storage.js.map