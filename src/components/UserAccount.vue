<template>
  <div class="user-account-container text-left">
    <h1 class="text-center">My Account</h1>
    <hr/>
    <div v-if="account">
      <TransferToken :tokens="tokenSummaryToIdMapArray"/>
      <br/>
      <h3 class="text-left">My Tokens</h3>
      <hr/>
      <div v-for="(token, idx) in tokenSummaryToIdMapArray" :key="idx">
        <p>
          <span class="ml-2">
           Token ID: #<span class="text-muted">{{token.tokenId}}</span>
          </span>
          <span class="ml-2">
            Product Code: <span class="text-muted">{{token._productId}}</span>
          </span>
        </p>
        <hr/>
      </div>
    </div>
    <div v-else>
      <p class="text-center pt-5">
        Please login to see tokens you currently own
      </p>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import TransferToken from '@/components/TransferToken.vue';
    import {mapState} from "vuex";

    @Component({
        components: {
            TransferToken,
        },
        computed: {
            ...mapState(['account']),
        }
    })
    export default class UserAccount extends Vue {
        account: any;

        tokenIds: string[] = [];
        tokenSummaryToIdMapArray: any[] = [];

        async fetchTokenInfoFromTokenIDs(tokenIds: string[]) {
            this.tokenIds = tokenIds;
            this.tokenSummaryToIdMapArray = await Promise.all(
                tokenIds.map(async (tokenId: string) => {
                    const attributes = await this.$store.dispatch('attributesForTokenId', tokenId);
                    return {
                        text: `Token ID: #${tokenId} - Product Code: ${attributes._productId}`,
                        value: tokenId, // n.b: value is used by b-form-select
                        tokenId,
                        ...attributes
                    }
                })
            );
        }

        mounted() {
            if (this.account) {
                this.$store.dispatch('tokensOfOwner', this.account)
                    .then(data => this.fetchTokenInfoFromTokenIDs(data));
            }
        }

        @Watch('account')
        onAccountChange(newVal: any, oldVal: any) {
            if (newVal !== oldVal) {
                this.$store.dispatch('tokensOfOwner', newVal)
                    .then(data => this.fetchTokenInfoFromTokenIDs(data));
            }
        }
    }
</script>

<style scoped>

</style>
