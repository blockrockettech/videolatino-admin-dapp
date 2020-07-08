<template>
    <div>
        <div v-if="accountInfo">
            <h1 class="heading">API Management</h1>
            <hr/>
            <h5>Info about the current state of the API:</h5>
            <div>
                Balance: {{accountInfo.balance}}
            </div>
            <div>
                Current GAS price: {{accountInfo.currentGasPrice}}
            </div>
            <div>
                Current GAS threshold: {{accountInfo.currentGasThreshold}}
            </div>
            <br/>
            <br/>
            <div>
                If you need to top up the API balance, you need to send ETH to:
            </div>
            <strong>
                <code>{{accountInfo.address}}</code>
            </strong>
        </div>
        <div v-else>

        </div>
    </div>
</template>

<script>
  import ApiService from "@/services/api.service";

  export default {
    name: "ApiManagement",
    data() {
      return {
        accountInfo: null,
      };
    },
    async mounted() {
      this.accountInfo = await ApiService.getAccountInfo('4');
      console.log(this.accountInfo);
    }
  }
</script>

<style scoped>

</style>