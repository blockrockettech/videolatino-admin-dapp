// @ts-ignore
import Web3Modal from 'web3modal';

// @ts-ignore
// import Portis from '@portis/web3';

const providerOptions = {
  // portis: {
  //   package: Portis,
  //   options: {
  //     id: 'b0863293-e454-4941-88ee-4a5eed9577b7'
  //   }
  // },
};

const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
  providerOptions
});

export default web3Modal;
