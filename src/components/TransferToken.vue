<template>
  <div>
    <h3>Transfer</h3>
    <hr/>
    <div class="form-group row">
      <label for="tokenId" class="col-sm-3 col-form-label">Token:</label>
      <div class="col-sm-9">
        <b-form-select id="tokenId" class="mb-3"
                       v-model="selectedToken"
                       :options="tokens">
          <!-- This slot appears above the options from 'options' prop -->
          <template v-slot:first>
            <option :value="null" disabled>-- Please select a token --</option>
          </template>
        </b-form-select>
      </div>
    </div>
    <div v-if="selectedToken">
      <h5>Selected Token</h5>
      <hr/>
      <div class="form-group row">
        <label class="col-sm-3 col-form-label">Token ID:</label>
        <div class="col-sm-9">
          {{selectedToken}}
        </div>
      </div>
      <div class="form-group row">
        <label for="sendTo" class="col-sm-3 col-form-label">Send To:</label>
        <div class="col-sm-9">
          <input id="sendTo" class="form-control" type="text" v-model="recipient"/>
        </div>
      </div>
      <b-button variant="primary"
                class=""
                @click="transferToken"
                :disabled="!recipient">
        Transfer
      </b-button>
      <div v-if="transfering">
        <small>
          <a :href="`https://etherscan.io/tx/${txHash}`" target="_blank">
            View TX in flight
          </a>
        </small>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({})
    export default class TransferToken extends Vue {
        @Prop({
            required: true
        })
        tokens!: any[];

        selectedToken: any = null;
        recipient: string = '';

        transfering: boolean = false;
        txHash: string = '';

        async transferToken() {
            this.txHash = await this.$store.dispatch('transferToken', {
                recipient: this.recipient,
                tokenId: this.selectedToken,
            });
            this.transfering = true;
        }
    }
</script>

<style scoped>

</style>
