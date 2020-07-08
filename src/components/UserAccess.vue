<template>
  <div>
    <h1 class="heading">User Access Controls</h1>
    <hr/>
    <div class="row text-left my-1">
      <div class="col">
        <h4>Select a token</h4>
        <div class="row my-3">
          <div class="col-2">
            <label for="tokenSelect">Token</label>
          </div>
          <div class="col-4 form-group">
            <select
              id="tokenSelect"
              name="tokenSelect"
              class="form-control"
              @change="resetData"
              v-model="selectedToken">
              <option value="">Please select one</option>
              <option v-for="token in tokenSelectionOptions" :value="token.text">{{token.text}}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedToken">
      <div class="row text-left my-1">
        <div class="col">
          <h4>Minting</h4>
          <p>
            Those with minting access can create {{selectedToken}} NFTs.
          </p>
          <p>
            Use the form below to mange addresses which are allowed to mint tokens for {{selectedToken}}.
          </p>

          <!-- Check minter access -->
          <h5>Check minter access</h5>
          <div class="row mt-2">
            <div class="col-2">
              <label for="ethAddress-can-mint">ETH Address</label>
            </div>
            <div class="col-4">
              <b-form-input id="ethAddress-can-mint"
                            type="text"
                            @input="clearCanMintResult"
                            v-model="canMintEthAddress.value"
                            placeholder="0x123..."/>
            </div>
            <div class="col-6">
              <b-button class="ml-2"
                        @click="applyCurrentAddressToCanMint"
                        variant="link"
                        :disabled="!account">
                use current account
              </b-button>
              <b-button class="ml-2"
                        variant="primary"
                        @click="checkCanMint"
                        v-if="!canMintEthAddress.loading"
                        :disabled="canMintEthAddress.value.length < 42">
                Can mint?
              </b-button>
              <b-button class="ml-2"
                        variant="primary"
                        v-if="canMintEthAddress.loading" disabled>
                <SmallSpinner/>
              </b-button>
            </div>
          </div>
          <div class="mt-3" v-if="!canMintEthAddress.loading && canMintEthAddress.result === true">
            <p class="d-inline-block">
              The ETH address <strong>{{canMintEthAddress.value}}</strong> can mint {{selectedToken}} NFTs
            </p>
            <font-awesome-icon icon="check-circle" class="text-success ml-2" size="lg">
            </font-awesome-icon>
          </div>
          <div class="mt-3" v-if="!canMintEthAddress.loading && canMintEthAddress.result === false">
            <p class="d-inline-block">
              The ETH address <strong>{{canMintEthAddress.value}}</strong> cannot mint {{selectedToken}} NFTs
            </p>
            <font-awesome-icon icon="times-circle" class="text-danger ml-2" size="lg">
            </font-awesome-icon>
          </div>

          <!-- Add/remove minter access -->
          <h5 class="mt-3">Manage minter access</h5>
          <div class="row">
            <div class="col-2">
              <label for="ethAddress-add-remove-minter">ETH Address</label>
            </div>
            <div class="col-4">
              <b-form-input id="ethAddress-add-remove-minter" type="text"
                            v-model="addRemoveMinterEthAddress.value"
                            placeholder="0x123..."/>
            </div>
            <div class="col-6">
              <b-button class="btn-success ml-2 mr-2"
                        @click="addMinter"
                        :disabled="!(account && addRemoveMinterEthAddress.value.length === 42)">
                Add
              </b-button>
              <b-button class="btn-danger"
                        @click="removeMinter"
                        :disabled="!(account && addRemoveMinterEthAddress.value.length === 42)">
                Remove
              </b-button>
              <txs-link :hash="addRemoveMinterEthAddress.result"></txs-link>
            </div>
          </div>

          <div class="mt-3" v-if="allWhitelistedAddresses && allWhitelistedAddresses.length">
            <h5>All Whitelisted Addresses</h5>
            <div v-for="(whitelistedAddress, idx) in allWhitelistedAddresses" :key="idx">
              {{whitelistedAddress}}
            </div>
          </div>
          <b-button variant="primary" class="mt-3" @click="displayAllWhitelistedAddresses">
            View All Whitelised Addresses
          </b-button>
        </div>
      </div>

      <hr/>

      <div class="row text-left">
        <div class="col">
          <h4>Root Admin</h4>
          <p>
            Those with admin access can control who is allowed to mint tokens.
          </p>
          <p>
            Add an address that can also have root access
          </p>

          <!-- Check admin access -->
          <div class="row">
            <div class="col-2">
              <label for="ethAddress-is-admin">ETH Address</label>
            </div>
            <div class="col-4">
              <b-form-input id="ethAddress-is-admin"
                            type="text"
                            v-model="isAdminEthAddress.value"
                            @input="clearIsAdminEthAddressResult"
                            placeholder="0x123..."/>
            </div>
            <div class="col-6">
              <b-button class="ml-2"
                        variant="link"
                        @click="applyCurrentAddressToIsAdmin"
                        :disabled="!account">
                use current account
              </b-button>
              <b-button class="ml-2"
                        variant="primary"
                        @click="checkIsAdmin"
                        v-if="!isAdminEthAddress.loading"
                        :disabled="isAdminEthAddress.value.length < 42">
                Is admin?
              </b-button>
              <b-button class="ml-2"
                        variant="primary"
                        v-if="isAdminEthAddress.loading" disabled>
                <SmallSpinner/>
              </b-button>
            </div>
          </div>
          <div class="mt-3" v-if="!isAdminEthAddress.loading && isAdminEthAddress.result === true">
            <p class="d-inline-block">
              The ETH address <strong>{{isAdminEthAddress.value}}</strong> is a {{selectedToken}} admin
            </p>
            <font-awesome-icon icon="check-circle" class="text-success ml-2" size="lg">
            </font-awesome-icon>
          </div>
          <div class="mt-3" v-if="!isAdminEthAddress.loading && isAdminEthAddress.result === false">
            <p class="d-inline-block">
              The ETH address <strong>{{canMintEthAddress.value}}</strong> is not a {{selectedToken}} admin
            </p>
            <font-awesome-icon icon="times-circle" class="text-danger ml-2" size="lg">
            </font-awesome-icon>
          </div>

          <!-- Add admin access -->
          <div class="row mt-2">
            <div class="col-2">
              <label for="ethAddress-add-remove-admin" class="searchLabel">ETH Address</label>
            </div>
            <div class="col-4">
              <b-form-input id="ethAddress-add-remove-admin" type="text"
                            v-model="addAdminEthAddress.value"
                            placeholder="0x123..."/>
            </div>
            <div class="col-4">
              <b-button class="btn-success ml-2 mr-2"
                        @click="addAdmin"
                        :disabled="!(account && addAdminEthAddress.value)">
                Add
              </b-button>
              <txs-link :hash="addAdminEthAddress.result"></txs-link>
            </div>
          </div>

          <div class="mt-3" v-if="allAdminWhitelistedAddresses && allAdminWhitelistedAddresses.length">
            <h5>All Admin Whitelisted Addresses</h5>
            <div v-for="(adminWhitelistedAddress, idx) in allAdminWhitelistedAddresses" :key="idx">
              {{adminWhitelistedAddress}}
            </div>
          </div>
          <b-button variant="primary"
                    class="mt-3"
                    @click="displayAllAdminWhitelistedAddresses">
            View All Admin Whitelised Addresses
          </b-button>

          <hr/>

          <!-- Remove minter access -->
          <p>
            Once remove you will no longer be able to administer root access
          </p>
          <div class="row mt-2">
            <div class="col-12">
              <b-button class="btn-danger" @click="renounceWhitelistAdmin"
                        :disabled="!isConnected || !account">
                Renounce admin access
              </b-button>
              <span
                class="ml-2">(This is non-reversible, make sure you know what you are doing!)</span>
              <txs-link :hash="renounceAdminHash"></txs-link>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapGetters, mapState} from "vuex";

    import Spinner from './Spinner.vue';
    import SmallSpinner from "@/components/SmallSpinner.vue";
    import TxsLink from "@/components/TxsLink.vue";

    interface InputModel {
        value: string,
        loading: boolean,
        result?: any
    }

    @Component({
        components: {TxsLink, SmallSpinner, Spinner},
        computed: {
            ...mapGetters(['isConnected', 'tokens']),
            ...mapState(['account']),
        }
    })
    export default class UserAccess extends Vue {
        canMintEthAddress: InputModel = {value: '', loading: false};
        addRemoveMinterEthAddress: InputModel = {value: '', loading: false};
        isAdminEthAddress: InputModel = {value: '', loading: false};
        addAdminEthAddress: InputModel = {value: '', loading: false};
        renounceAdminHash: string = '';
        account: any;
        allWhitelistedAddresses: string[] = [];
        allAdminWhitelistedAddresses: string[] = [];
        selectedToken: any = null;

        get tokenSelectionOptions() {
          // @ts-ignore
          return this.tokens.map((token: any) => ({text: token.name}));
        }

        resetData() {
          this.allWhitelistedAddresses = [];
          this.allAdminWhitelistedAddresses = [];
          this.canMintEthAddress = {value: '', loading: false};
          this.addRemoveMinterEthAddress = {value: '', loading: false};
          this.isAdminEthAddress = {value: '', loading: false};
          this.addAdminEthAddress = {value: '', loading: false};
          this.renounceAdminHash = '';
        }

        clearCanMintResult() {
            this.canMintEthAddress.result = null;
        }

        clearIsAdminEthAddressResult() {
            this.isAdminEthAddress.result = null;
        }

        applyCurrentAddressToCanMint() {
            this.canMintEthAddress.value = this.account;
            this.canMintEthAddress.result = null;
        }

        applyCurrentAddressToIsAdmin() {
            this.isAdminEthAddress.value = this.account;
            this.isAdminEthAddress.result = null;
        }

        async displayAllWhitelistedAddresses() {
            this.allWhitelistedAddresses =
                await this.$store.dispatch('fetchAllWhitelistedAddresses', this.selectedToken);
        }

        async displayAllAdminWhitelistedAddresses() {
            this.allAdminWhitelistedAddresses =
                await this.$store.dispatch('fetchAllAdminWhitelistedAddresses', this.selectedToken);
        }

        checkCanMint() {
            this.canMintEthAddress.loading = true;
            this.$store.dispatch('checkCanMint', {
              ethAddress: this.canMintEthAddress.value,
              selectedToken: this.selectedToken
            })
                .then((data) => this.canMintEthAddress.result = data)
                .catch(() => this.canMintEthAddress.result = false)
                .finally(() => this.canMintEthAddress.loading = false);
        }

        addMinter() {
            this.addRemoveMinterEthAddress.loading = true;
            this.$store.dispatch('addWhitelisted', {
              ethAddress: this.addRemoveMinterEthAddress.value,
              selectedToken: this.selectedToken
            })
                .then((data) => {
                    Vue.set(this.addRemoveMinterEthAddress, 'result', data);
                })
                .catch(() => this.addRemoveMinterEthAddress.result = false)
                .finally(() => this.addRemoveMinterEthAddress.loading = false);
        }

        removeMinter() {
            this.addRemoveMinterEthAddress.loading = true;
            this.$store.dispatch('removeWhitelisted', {
              ethAddress: this.addRemoveMinterEthAddress.value,
              selectedToken: this.selectedToken
            })
                .then((data) => {
                    Vue.set(this.addRemoveMinterEthAddress, 'result', data);
                })
                .catch(() => this.addRemoveMinterEthAddress.result = false)
                .finally(() => this.addRemoveMinterEthAddress.loading = false);
        }

        checkIsAdmin() {
            this.isAdminEthAddress.loading = true;
            this.$store.dispatch('checkIsAdmin', {
              ethAddress: this.isAdminEthAddress.value,
              selectedToken: this.selectedToken
            })
                .then((data) => this.isAdminEthAddress.result = data)
                .catch(() => this.isAdminEthAddress.result = false)
                .finally(() => this.isAdminEthAddress.loading = false);
        }

        addAdmin() {
            this.addAdminEthAddress.loading = true;
            this.$store.dispatch('addWhitelistAdmin', {
              ethAddress: this.addAdminEthAddress.value,
              selectedToken: this.selectedToken
            })
                .then((data) => {
                    Vue.set(this.addAdminEthAddress, 'result', data);
                })
                .catch(() => this.addAdminEthAddress.result = false)
                .finally(() => this.addAdminEthAddress.loading = false);
        }

        renounceWhitelistAdmin() {
            this.renounceAdminHash = '';
            this.$store.dispatch('renounceWhitelistAdmin', this.selectedToken)
                .then((data) => this.renounceAdminHash = data);
        }

    }
</script>

<style scoped>

</style>
