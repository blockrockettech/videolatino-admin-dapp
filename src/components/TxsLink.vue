<template>
    <span v-if="hash">
      <div :class="containerClass">
        <slot></slot>
        <button class="btn btn-link text-muted" @click="visitLink">[View Transaction]</button>
      </div>
    </span>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: 'txs-link',
        props: [
            'hash',
            'containerClass'
        ],
        computed: {
            ...mapState(['etherscanBase'])
        },
        methods: {
            visitLink() {
                window.open(`${this.etherscanBase}/tx/${this.hash}`, '_blank');
            }
        }
    };
</script>

<style scoped lang="scss">

</style>
