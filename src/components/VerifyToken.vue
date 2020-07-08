<template>
  <div class="txt">
    <h1 class="heading">NFT Verification</h1>
    <hr/>
    <div class="row text-left my-1">
      <div class="col">
          <b-input-group prepend="Token" class="mb-2 mr-sm-2 mb-sm-0 fixed-width-input">
            <select
              id="tokenSelect"
              name="tokenSelect"
              class="mb-2 mb-sm-0 form-control"
              @change="resetData"
              v-model="selectedToken">
              <option value="">Please select one</option>
              <option v-for="token in tokenSelectionOptions" :value="token.text">{{token.text}}</option>
            </select>
          </b-input-group>
        </div>

    </div>
    <div v-if="selectedToken">
      <div class="row">
        <div class="col">

          <b-form inline class="my-2">

            <b-input-group prepend="Product ID" class="mb-2 mr-sm-2 mb-sm-0 fixed-width-input">
              <b-input
                id="productId"
                class="mb-2 mb-sm-0"
                placeholder="ABC-001..."
                v-model="productId"
              ></b-input>
            </b-input-group>

            <b-button class="ml-2"
                      @click="performProductSearch"
                      v-if="!searching"
                      variant="primary"
                      :disabled="!productId">
              Search
            </b-button>

            <b-button class="ml-2"
                      variant="primary"
                      v-if="searching && productId" disabled>
              <SmallSpinner/>
            </b-button>
          </b-form>

          <b-form inline class="my-2">

            <b-input-group prepend="Token ID" class="mb-2 mr-sm-2 mb-sm-0 fixed-width-input">
              <b-input placeholder="1..."
                       v-model="tokenId">
              </b-input>
            </b-input-group>

            <b-button class="ml-2"
                      @click="performTokenSearch"
                      variant="primary"
                      v-if="!searching"
                      :disabled="!tokenId">
              Search
            </b-button>

            <b-button class="ml-2"
                      variant="primary"
                      v-if="searching && tokenId" disabled>
              <SmallSpinner/>
            </b-button>
          </b-form>
        </div>
      </div>

      <div v-if="searching && !noResultFound">
        <Spinner/>
      </div>

      <div id="searchResults" v-if="results" class="my-4">
        <div class="row">
          <div class="col text-left">

            <h4 class="heading text-center">Product ID: {{tokenData.attributes.product_id || tokenData.attributes.video_id}}</h4>
            <table class="table table-striped table-borderless">
              <tbody>
              <tr>
                <td>Name:</td>
                <td>{{tokenData.name}}</td>
              </tr>
              <tr>
                <td>Description:</td>
                <td>{{tokenData.description}}</td>
              </tr>
              <tr v-for="(attributeKey,idx) in Object.keys(tokenData.attributes)" :key="idx">
                <td>{{convertStringToPascalCase(attributeKey.replace('_', ' '))}}:</td>
                <td>{{tokenData.attributes[attributeKey]}}</td>
              </tr>
              <tr v-if="tokenData.materialsUsed">
                <td>Materials Used:</td>
                <td>{{tokenData.materialsUsed}}</td>
              </tr>
              </tbody>
            </table>

          </div>
          <div class="col">
            <div class="img-container">
              <img class="img" :src="ipfsData.image" alt=""/>
            </div>
            <div class="small mt-1">
              <a :href="openSeaTokenLink(currentTokenId, selectedToken)" target="_blank">→ view token on OpenSea</a>
            </div>
            <div class="small mt-1">
              <a :href="etherscanTokenLink(currentTokenId, selectedToken)" target="_blank">→ view token on
                Etherscan</a>
            </div>
            <div class="small mt-1">
              <a :href="tokenURI" target="_blank">→ view token data on IPFS</a>
            </div>
            <div class="text-left small">
              <hr/>
              <div class="mt-1">
                <span class="font-weight-bold">1. Date Created:</span> {{dateCreated}}
                <CopyIcon :text="dateCreated"></CopyIcon>
              </div>
              <div class="mt-1">
                <span class=" font-weight-bold">2. Transaction Hash:</span> {{transactionHash}}
                <CopyIcon :text="transactionHash"></CopyIcon>
              </div>
              <div class="mt-1">
                <span class=" font-weight-bold">3. Contract Address:</span> {{tokenLandiaContractAddress}}
                <CopyIcon :text="tokenLandiaContractAddress"></CopyIcon>
              </div>
              <div class="mt-1">
                <span class=" font-weight-bold">4. Etherscan:</span> {{etherscanTokenLink(currentTokenId, selectedToken)}}
                <CopyIcon :text="etherscanTokenLink(currentTokenId, selectedToken)"></CopyIcon>
              </div>
              <div class="mt-1">
                <span class=" font-weight-bold">5. OpenSea:</span> {{openSeaTokenLink(currentTokenId, selectedToken)}}
                <CopyIcon :text="openSeaTokenLink(currentTokenId, selectedToken)"></CopyIcon>
              </div>
              <div class="mt-1">
                <span class=" font-weight-bold">6. IPFS Data:</span> {{tokenURI}}
                <CopyIcon :text="tokenURI"></CopyIcon>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="!results && !searching && !noResultFound" class="mt-4">
        <p>
          Please fill in one field from the search form above.
        </p>
      </div>
      <div v-if="noResultFound" class="mt-4">
        No results found
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {mapGetters, mapState} from "vuex";
  import axios from 'axios';

  import Spinner from './Spinner.vue';
  import SmallSpinner from "@/components/SmallSpinner.vue";
  import CopyIcon from "@/components/CopyIcon.vue";
  import moment from "moment";

  @Component({
    components: {CopyIcon, SmallSpinner, Spinner},
    computed: {
      ...mapState(['tokenLandiaContractAddress']),
      ...mapGetters(['etherscanTokenLink', 'openSeaTokenLink', 'tokens']),
    }
  })
  export default class VerifyToken extends Vue {
    searching: boolean = false;
    noResultFound: boolean = false;

    productId: string = '';
    tokenId: string = '';
    currentTokenId: string = '';
    foundTokenId: string = '';

    attributes: any = {};
    tokenURI: string = '';
    ownerOf: string = '';
    dateCreated: string = '';
    transactionHash: string = '';

    ipfsData: any = {};
    ipfsDataRetrieved: boolean = false;

    etherscanTokenLink!: (tokenId: string, selectedToken: string) => string;
    openSeaTokenLink!: (tokenId: string, selectedToken: string) => string;

    selectedToken: any = null;

    get tokenSelectionOptions() {
      // @ts-ignore
      return this.tokens.map((token: any) => ({text: token.name}));
    }

    resetData() {
      this.productId = '';
      this.tokenId = '';
      this.ipfsDataRetrieved = false;
      this.ipfsData = {};
      this.searching = false;
      this.attributes = {};
      this.ownerOf = '';
      this.tokenURI = '';
      this.transactionHash = '';
      this.dateCreated = '';
      this.noResultFound = false;
    }

    performTokenSearch() {
      this.ipfsDataRetrieved = false;
      this.searching = true;
      this.attributes = {};
      this.ownerOf = '';
      this.tokenURI = '';
      this.noResultFound = false;

      const isTokenIdSearch = this.tokenId.trim() !== '' && !isNaN(Number(this.tokenId));
      if (isTokenIdSearch) {
        this.findInformationForTokenId(this.tokenId);
      }
    }

    performProductSearch() {
      this.ipfsDataRetrieved = false;
      this.searching = true;
      this.attributes = {};
      this.ownerOf = '';
      this.tokenURI = '';
      this.noResultFound = false;

      const isProductIdSearch = this.productId.trim() !== '';


      if (isProductIdSearch) {
        this.$store.dispatch('tokenIdForProductId', {
          productId: this.productId,
          selectedToken: this.selectedToken
        })
          .then((tokenId) => {
            this.findInformationForTokenId(tokenId);
          })
          .catch(() => {
            this.noResultFound = true;
            this.searching = false;
          });
      }
    }

    findInformationForTokenId(tokenId: any) {
      this.foundTokenId = tokenId;

      this.$store.dispatch('getTokenIdOrProductCodeInfo', {
        tokenIdOrProductCode: tokenId,
        selectedToken: this.selectedToken
      })
        .then((results) => {
          this.transactionHash = results.transaction_hash;
          this.dateCreated = moment.unix(results.created).format('YYYY-MM-DD');
        });

      this.$store.dispatch('findInformationForTokenId', {
        tokenId,
        selectedToken: this.selectedToken
      })
        .then(({attributes, tokenURI, ownerOf}) => {
          this.attributes = attributes;
          this.ownerOf = ownerOf;
          this.tokenURI = tokenURI;
          this.productId = "";
          this.tokenId = "";
          this.currentTokenId = tokenId;
        })
        .catch(() => {
          this.searching = false;
          this.noResultFound = true;
        });
    }

    convertStringToPascalCase(original: string) {
      let convertedString = original.replace(/(\w)(\w*)/g, (g0, g1, g2) => {
        return g1.toUpperCase() + g2.toLowerCase();
      });

      switch (convertedString) {
        case 'Coo':
          return 'COO';
        case 'Product Id':
          return 'Product ID';
        case 'Token Id':
          return 'Token ID';
      }

      return convertedString;
    }

    get results(): boolean {
      if (this.searching && this.attributes && this.tokenURI) {
        axios.get(this.tokenURI)
          .then((response: any) => {
            if (response && response.status === 200) {
              this.ipfsData = response.data;
              this.ipfsDataRetrieved = true;
              this.searching = false;
            } else {
              alert(`Unable to retrieve IPFS data for ${this.productId.trim()}`);
            }
          });
      }
      return this.ipfsDataRetrieved;
    }

    get tokenData() {
      const data: any = {
        ...this.ipfsData,
        materialsUsed: [],
      };

      Object.keys(data.attributes).forEach(key => {
        if (key.indexOf('material') !== -1) {
          data.materialsUsed.push(data.attributes[key]);
        }
      });

      if (data.materialsUsed.length) {
        data.materialsUsed = data.materialsUsed.join(', ');

        const newAttributes: any = {};
        Object.keys(data.attributes)
          .filter(key => key.indexOf('material') === -1)
          .forEach(key => {
            newAttributes[key] = data.attributes[key]
          });
        data.attributes = newAttributes;
      } else {
        data.materialsUsed = null;
      }

      return data;
    }
  }
</script>

<style lang="scss" scoped>
  @import "../colours.scss";

  .input-group > .input-group-prepend > .input-group-text {
    width: 105px;
  }

  .fixed-width-input {
    width: 325px;
  }

  .img-container {
    margin: 2rem 0;
  }

  .img {
    height: 345px;
  }

  .dateLabel {
    width: 265px;
  }

  strong {
    color: $gray;
    font-weight: normal;
  }
</style>
