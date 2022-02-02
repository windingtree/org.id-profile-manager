import 'dotenv/config';
import type { IPFS } from '../src';
import { utils, Web3StorageApi } from '../src';
import chai, { expect } from 'chai';
import chp from 'chai-as-promised';
chai.use(chp);

describe('Web3Storage API', () => {
  let apiKey: string;
  let gateway: IPFS;
  let stor: Web3StorageApi;

  before(async () => {
    apiKey = process.env['WEB3_STORAGE_API_KEY'] as string;
    gateway = await utils.startIpfsGateway();
    stor = new Web3StorageApi(apiKey, gateway);
  });

  after(async () => {
    await gateway.stop();
  });

  describe('#add', () => {

    it('should add object as a file', async () => {
      const hello = Math.random();
      const { cid } = await stor.add(
        utils.obj2File({ hello }, 'hello.json')
      );
      const data = JSON.parse(await stor.get(cid) as string);
      expect(data).to.have.haveOwnProperty('hello').to.equal(hello);
    });
  });
});
