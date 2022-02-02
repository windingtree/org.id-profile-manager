"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.Web3StorageApi = void 0;
const web3Storage_1 = require("./apis/web3Storage");
Object.defineProperty(exports, "Web3StorageApi", { enumerable: true, get: function () { return web3Storage_1.Web3StorageApi; } });
const utils_1 = require("./utils");
const utils = { startIpfsGateway: utils_1.startIpfsGateway, obj2File: utils_1.obj2File };
exports.utils = utils;
//# sourceMappingURL=index.js.map