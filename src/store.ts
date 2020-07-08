import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger'

// @ts-ignore
import notifier from "./notifier.js"

// @ts-ignore
import * as Web3 from 'web3';

import axios from 'axios';

const {getWhitelistedAddresses} = require("./utils");
const {getNetworkName} = require("@blockrocket/utils");
const TokenlandiaJson = require("./truffleconf/token/Tokenlandia.json");
const VideoLatinoJson = require("./truffleconf/token/VideoLatino.json");
const TrustedNftEscrowJson = require("./truffleconf/escrow/TrustedNftEscrow.json");

Vue.use(Vuex);

let tokenLandiaContract: any = {};
let videoLatinoContract: any = {};

function getTokenContract(selectedToken: string, state: any) {
  return selectedToken === 'Tokenlandia' ?
    state.tokenLandiaContract
    :
    state.videoLatinoContract;
}

export default new Vuex.Store({
  plugins: [createLogger()],
  state: {
    // Network
    networkId: 1,
    networkName: 'Mainnet',
    etherscanBase: 'https://etherscan.io',
    openseaBase: 'https://opensea.io',

    // Account
    account: null,
    accountProperties: {
      canMint: null, // if the user can mint tokenlandia
      canMintVideoLatino: null,
      staticWeb3: false,
    },

    // Countracts
    web3: null,
    notifyInstance: null,
    tokenLandiaContract: tokenLandiaContract,
    tokenLandiaContractAddress: '',
    escrowContractAddress: '',
    videoLatinoContract: videoLatinoContract,
    videoLatinoContractAddress: ''
  },
  mutations: {
    networkDetails(state, {networkId, networkName, etherscanBase, openseaBase}) {
      state.networkId = networkId;
      state.networkName = networkName;
      state.etherscanBase = etherscanBase;
      state.openseaBase = openseaBase;
      state.notifyInstance = notifier(networkId);

      if (TokenlandiaJson.networks[state.networkId]) {
        state.tokenLandiaContractAddress = TokenlandiaJson.networks[state.networkId].address;
        // @ts-ignore
        state.tokenLandiaContract = new state.web3.eth.Contract(TokenlandiaJson.abi, state.tokenLandiaContractAddress);
      }

      if (VideoLatinoJson.networks[state.networkId]) {
        state.videoLatinoContractAddress = VideoLatinoJson.networks[state.networkId].address;
        // @ts-ignore
        state.videoLatinoContract = new state.web3.eth.Contract(VideoLatinoJson.abi, state.videoLatinoContractAddress);
      }

      if (TrustedNftEscrowJson.networks[state.networkId]) {
        state.escrowContractAddress = TrustedNftEscrowJson.networks[state.networkId].address;
      }
    },
    account(state, account) {
      state.account = account;
    },
    web3(state, web3) {
      state.web3 = web3;
    },
    updateAccountProperties(state, mintingCapabilities) {
      const {canMintTokenlandia, canMintVideoLatino} = mintingCapabilities;
      state.accountProperties.canMint = canMintTokenlandia;
      state.accountProperties.canMintVideoLatino = canMintVideoLatino;
      state.accountProperties.staticWeb3 = !state.account;
    },
  },
  getters: {
    isConnected() {
      // @ts-ignore
      return window.web3 !== undefined;
    },
    etherscanTokenLink: state => (tokenId: string, selectedToken: string) => {
      const networkAddress = getTokenContract(selectedToken, state)._address;
      return `${state.etherscanBase}/token/${networkAddress}?a=${tokenId}`;
    },
    openSeaTokenLink: state => (tokenId: string, selectedToken: string) => {
      const networkAddress = getTokenContract(selectedToken, state)._address;
      return `${state.openseaBase}/assets/${networkAddress}/${tokenId}`;
    },
    accountProperties: state => state.accountProperties,
    validateAddress: state => (address: string) => {
      // @ts-ignore
      return state.web3.utils.isAddress(address);
    },
    checksumAddress: state => (address: string) => {
      try {
        // @ts-ignore
        return state.web3.utils.toChecksumAddress(address);
      } catch (e) {
        return address;
      }
    },
    canAccountMint: state => state.account && state.accountProperties.canMint === true,
    canAccountMintVideoLatino: state => state.account && state.accountProperties.canMintVideoLatino === true,
    escrowAccountAddress: state => state.escrowContractAddress,
    tokens: state => {
      return [
        {name: 'Tokenlandia', address: state.tokenLandiaContractAddress},
        {name: 'Video Latino', address: state.videoLatinoContractAddress}
      ];
    },
  },
  actions: {

    bootstrap({dispatch}, provider) {
      dispatch('loginWeb3', provider);
    },

    /////////////////////////
    // Web3 initialisation //
    /////////////////////////

    async loginWeb3({dispatch, state}, provider) {
      if (!state.account) {
        // @ts-ignore
        window.web3 = new Web3(provider);
        // @ts-ignore
        dispatch('initWeb3', window.web3);
      }
    },

    initWeb3({commit, dispatch}, web3) {
      commit('web3', web3);

      dispatch('getNetwork').then(() => {
        web3.eth.getAccounts((error: any, accounts: any) => {
          if (!error) {
            const account = accounts[0];
            commit('account', account);

            dispatch('checkMintingCapabilitiesForAllTokens', account)
              .then(mintingCapabilities => commit('updateAccountProperties', mintingCapabilities))
              .catch(() => commit('updateAccountProperties', {canMintTokenlandia: false, canMintVideoLatino: false}));
          } else {
            console.log(`Error getting accounts`, error);
          }
        });
      });
    },

    setupStaticWeb3({dispatch, commit}) {
      console.log(`No web3 provider found, defaulting to static web3 instance`);
      const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/27742a31ed334a5cb63ef2560e01b621`));
      // @ts-ignore
      window.web3 = web3;
      dispatch('initWeb3', web3);
    },

    async getNetwork({commit, dispatch}) {
      const networkId = await dispatch('getNetworkId');
      const networkName = await getNetworkName(networkId);
      const etherscanBase = await dispatch('getEtherscanAddress', networkId);
      const openseaBase = await dispatch('getOpenseaAddress', networkId);
      return commit('networkDetails', {networkId, networkName, etherscanBase, openseaBase});
    },

    getNetworkId({state}) {
      // @ts-ignore
      return state.web3.eth.net.getId();
    },

    getEtherscanAddress({}, networkId) {
      switch (networkId) {
        case 1:
          return 'https://etherscan.io';
        case 4:
          return 'https://rinkeby.etherscan.io';
        default:
          return '';
      }
    },

    getOpenseaAddress({}, networkId) {
      switch (networkId) {
        case 1:
          return 'https://opensea.io';
        case 4:
          return 'https://rinkeby.opensea.io';
        default:
          return '';
      }
    },

    ////////////////////
    // Contract calls //
    ////////////////////

    tokenIdForProductId({state}, {productId, selectedToken}) {
      try {
        return selectedToken === 'Tokenlandia' ?
          state.tokenLandiaContract.methods.tokenIdForProductId(productId).call()
          :
          state.videoLatinoContract.methods.tokenIdForVideoId(productId).call();
      } catch (e) {
        return Promise.reject(null);
      }
    },

    getTokenIdOrProductCodeInfo({state}, {tokenIdOrProductCode, selectedToken}) {
      try {
        return axios.get(`https://api-56b6el2v7a-uc.a.run.app/v1/network/${state.networkId}/asset/${selectedToken.replace(' ', '')}/info/${tokenIdOrProductCode}`)
          .then((res) => res.data)
      } catch (e) {
        return Promise.reject(false);
      }
    },

    findInformationForTokenId({state}, {tokenId, selectedToken}) {
      try {
        return Promise.all([
          getTokenContract(selectedToken, state).methods.attributes(tokenId).call(),
          getTokenContract(selectedToken, state).methods.tokenURI(tokenId).call(),
          getTokenContract(selectedToken, state).methods.ownerOf(tokenId).call(),
        ])
          .then(([attributes, tokenURI, ownerOf]) => {
            return {attributes, tokenURI, ownerOf};
          });
      } catch (e) {
        return Promise.reject(false);
      }
    },

    attributesForTokenId({state}, tokenId) {
      return state.tokenLandiaContract.methods.attributes(tokenId).call();
    },

    mintToken({state}, {tokenId, recipient, productCode, ipfsHash, onceTxHash, onceReceipt, selectedToken}) {
      getTokenContract(selectedToken, state).methods.mintToken(tokenId, recipient, productCode, ipfsHash)
        .send({
          from: state.account
        })
        .once('transactionHash', (hash: any) => {
          // @ts-ignore
          state.notifyInstance.hash(hash);
          onceTxHash(hash);
      }).once('receipt', (receipt: any) => {
        onceReceipt(receipt);
      });
    },

    updateTokenIPFSHash({state}, {tokenId, ipfsHash, onceTxHash, onceReceipt}) {
      return new Promise((resolve, reject) => {
        state.tokenLandiaContract.methods.updateIpfsHash(tokenId, ipfsHash)
          .send({
            from: state.account
          })
          .once('transactionHash', (hash: string) => {
            // @ts-ignore
            state.notifyInstance.hash(hash);
            onceTxHash(hash);
          })
          .once('receipt', (receipt: any) => {
            onceReceipt(receipt);
          });
      });
    },

    transferToken({state}, {recipient, tokenId}) {
      return new Promise((resolve, reject) => {
        const from = state.account;
        state.tokenLandiaContract.methods.transferFrom(from, recipient, tokenId)
          .send({from})
          .once('transactionHash', (hash: string) => {
            // @ts-ignore
            state.notifyInstance.hash(hash);
            resolve(hash);
          })
          .on('error', reject);
      });
    },

    checkIsAdmin({state, commit, dispatch}, {ethAddress, selectedToken}) {
      try {
        return getTokenContract(selectedToken, state).methods.isWhitelistAdmin(ethAddress).call();
      } catch (e) {
        return Promise.resolve(false);
      }
    },

    checkCanMint({state, commit, dispatch}, {ethAddress, selectedToken}) {
      try {
        return getTokenContract(selectedToken, state).methods.isWhitelisted(ethAddress).call();
      } catch (e) {
        return Promise.resolve(false);
      }
    },

    async checkMintingCapabilitiesForAllTokens({state, commit, dispatch}, ethAddress) {
      try {
        const canMintTokenlandia = await getTokenContract('Tokenlandia', state).methods.isWhitelisted(ethAddress).call();
        const canMintVideoLatino = await getTokenContract('Video Latino', state).methods.isWhitelisted(ethAddress).call();
        return Promise.resolve({canMintTokenlandia, canMintVideoLatino});
      } catch (e) {
        return Promise.resolve(false);
      }
    },

    tokensOfOwner({state, commit, dispatch}, ethAddress) {
      try {
        return state.tokenLandiaContract.methods.tokensOfOwner(ethAddress).call();
      } catch (e) {
        return Promise.resolve(false);
      }
    },

    addWhitelisted({state}, {ethAddress, selectedToken}) {
      return new Promise((resolve, reject) => {
        getTokenContract(selectedToken, state).methods.addWhitelisted(ethAddress)
          .send({
            from: state.account
          })
          .once('transactionHash', (hash: string) => {
            // @ts-ignore
            state.notifyInstance.hash(hash);
            resolve(hash);
          })
          .on('error', reject);
      });
    },

    removeWhitelisted({state}, {ethAddress, selectedToken}) {
      return new Promise((resolve, reject) => {
        getTokenContract(selectedToken, state).methods.removeWhitelisted(ethAddress)
          .send({
            from: state.account
          })
          .once('transactionHash', (hash: string) => {
            // @ts-ignore
            state.notifyInstance.hash(hash);
            resolve(hash);
          })
          .on('error', reject);
      });
    },

    addWhitelistAdmin({state}, {ethAddress, selectedToken}) {
      return new Promise((resolve, reject) => {
        getTokenContract(selectedToken, state).methods.addWhitelistAdmin(ethAddress)
          .send({
            from: state.account
          })
          .once('transactionHash', (hash: string) => {
            // @ts-ignore
            state.notifyInstance.hash(hash);
            resolve(hash);
          })
          .on('error', reject);
      });
    },

    renounceWhitelistAdmin({state}, selectedToken) {
      return new Promise((resolve, reject) => {
        getTokenContract(selectedToken, state).methods.renounceWhitelistAdmin()
          .send({
            from: state.account
          })
          .once('transactionHash', (hash: string) => {
            // @ts-ignore
            state.notifyInstance.hash(hash);
            resolve(hash);
          })
          .on('error', reject);
      });
    },

    fetchAllWhitelistedAddresses({state}, selectedToken) {
      return new Promise((resolve, reject) => {
        const options = {
          fromBlock: 0, // FIXME deployed block
          toBlock: 'latest',
        };

        const tokenContract = getTokenContract(selectedToken, state);

        getWhitelistedAddresses({
          addedEventName: 'WhitelistedAdded',
          removedEventName: 'WhitelistedRemoved',
          tokenContract,
          options,
          resolve,
          reject
        });
      });
    },

    fetchAllAdminWhitelistedAddresses({state}, selectedToken) {
      return new Promise((resolve, reject) => {
        const options = {
          fromBlock: 0, // FIXME deployed block
          toBlock: 'latest',
        };

        const tokenContract = getTokenContract(selectedToken, state);

        getWhitelistedAddresses({
          addedEventName: 'WhitelistAdminAdded',
          removedEventName: 'WhitelistAdminRemoved',
          tokenContract,
          options,
          resolve,
          reject
        })
      });
    },

    async checkTokenIdIsValid({state}, tokenId) {
      try {
        // @ts-ignore
        await state.tokenLandiaContract.methods.attributes(tokenId).call();
        return true;
      } catch (e) {
        return false;
      }
    },

    async checkVideoLatinoTokenExists({state}, tokenId) {
      try {
        // @ts-ignore
        await state.videoLatinoContract.methods.attributes(tokenId).call();
        return true;
      } catch (e) {
        return false;
      }
    },

  }
});
