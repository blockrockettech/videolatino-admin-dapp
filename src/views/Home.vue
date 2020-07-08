<template>
  <div class="home">
    <AssetNFTGenerator />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AssetNFTGenerator from '@/components/minting/Assets.vue';

@Component({
  components: {
      AssetNFTGenerator,
  },
})
export default class Home extends Vue {}
</script>
