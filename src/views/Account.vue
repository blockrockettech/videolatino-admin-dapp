<template>
  <UserAccount />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import UserAccount from '@/components/UserAccount.vue';

    @Component({
        components: {
            UserAccount,
        },
    })
    export default class Account extends Vue {}
</script>
