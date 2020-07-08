const ipfsClient = require('ipfs-http-client');
import {Buffer} from "buffer";

const promiseRetry = require('promise-retry');

export default class InfuraIpfsService {

  ipfs = ipfsClient({
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https',
    timeout: '2m'
  });

  async pushBufferToIpfs(buffer: any, tryingToUpload: string): Promise<string> {

    const addBuffer = (): Promise<string> => {
      return this.ipfs.add(buffer, {pin: true});
    }

    return promiseRetry(function (retry: any, number: any) {
      console.log('IPFS pinning - attempt number', number);
      return addBuffer().catch(retry);
    }, {retries: 7})
      .then(
        function (results: any) {
          const result = results[0];
          return result && result.hash ? result.hash : 'unsuccessful';
        },
        function (err: any) {
          alert(`Failed to upload ${tryingToUpload} to IPFS - retries exceed - pls try again: ${err}`);
          return 'unsuccessful';
        }
      );
  }

  async uploadImageToIpfs(fileBuffer: any): Promise<string> {
    return this.pushBufferToIpfs(fileBuffer, 'image');
  }

  async pushJsonToIpfs(ipfsPayload: any): Promise<string> {
    const buffer = Buffer.from(JSON.stringify(ipfsPayload));
    return this.pushBufferToIpfs(buffer, 'token data');
  }
}
