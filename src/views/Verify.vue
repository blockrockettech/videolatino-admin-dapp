<template>
  <div class="verify">
    <VerifyToken />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VerifyToken from '@/components/VerifyToken.vue';

@Component({
  components: {
    VerifyToken,
  },
})
export default class Verify extends Vue {}
</script>
