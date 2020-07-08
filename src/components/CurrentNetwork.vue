<template>
  <span class="badge badge-light" v-if="networkName">{{ networkName }}</span>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: 'currentNetwork',
        computed: {
            ...mapState([
                'networkName',
                'account',
                'etherscanBase'
            ])
        },
    };
</script>

<style lang="scss" scoped>
    @import "../colours.scss";
</style>
