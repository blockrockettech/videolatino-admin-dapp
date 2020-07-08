<template>
    <div>
      <div class="row">
        <div class="col-12">
          <div class="mt-4">
            <div class="py-2 text-center" v-if="!saving && !transactionHash">
              <b-button type="submit" class="btn-block btn-lg" variant="primary"
                        :disabled="isActionBtnDisabled">
                {{actionBtnTxt}}
              </b-button>
              <p class="mt-2 text-danger" v-if="(formState.$invalid || generalFormStateInvalid) && formState.$dirty">
                {{invalidFormStateText}}
              </p>
            </div>
            <div class="py-2 text-center" v-else-if="saving && !ipfsDataHash && !transactionHash">
              <b-button type="button" class="btn-block btn-lg" variant="primary" disabled>
                <SmallSpinner/>
                Uploading data to IPFS...
              </b-button>
            </div>
            <div class="py-2 text-center" v-else-if="saving && ipfsDataHash && !transactionHash">
              <b-button type="button" class="btn-block btn-lg" variant="primary" disabled>
                Please authorize this transaction...
              </b-button>
            </div>
            <div v-else-if="ipfsDataHash && transactionHash">
              <txs-link :hash="transactionHash" containerClass="alert alert-success">
                <template>
                  {{transactionInflightText}} <SmallSpinner v-if="saving && ipfsDataHash && transactionHash"/>
                </template>
              </txs-link>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <b-card header-tag="header" class="mt-3" no-body>
            <template v-slot:header>
              <b-button variant="light" @click="toggleShowIPFSData" class="py-0">
                <span class="mr-2">View IPFS MetaData</span>
                <font-awesome-icon icon="caret-down" class="ml-auto">
                </font-awesome-icon>
              </b-button>
            </template>

            <b-alert class="text-left" variant="light" :show="showIPFSData">
              <div class="small text-muted mb-2">IPFS MetaData</div>
              <pre>{{ipfsPayload()}}</pre>
              <div>
                <a class="btn btn-link"
                   v-if="ipfsDataHash && ipfsDataHash !== 'unsuccessful'"
                   :href="baseIpfsUrl + ipfsDataHash" target="_blank">IPFS Link</a>
              </div>
            </b-alert>
          </b-card>
        </div>
      </div>
    </div>
</template>

<script>
    import SmallSpinner from "./SmallSpinner";
    import TxsLink from "@/components/TxsLink.vue";
    export default {
        name: "FormFooter",
        props: [
          'saving',
          'transactionHash',
          'isActionBtnDisabled',
          'actionBtnTxt',
          'formState',
          'generalFormStateInvalid',
          'invalidFormStateText',
          'ipfsDataHash',
          'ipfsPayload',
          'transactionInflightText'
        ],
        components: {SmallSpinner, TxsLink},
        data() {
          return {
            showIPFSData: false,
            baseIpfsUrl: 'https://ipfs.infura.io/ipfs/'
          };
        },
        methods: {
          toggleShowIPFSData() {
            this.showIPFSData = !this.showIPFSData;
          }
        }
    }
</script>

<style scoped>

</style>
