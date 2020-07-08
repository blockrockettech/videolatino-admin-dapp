<template>
  <div class="verify">
    <UserAccess />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import UserAccess from '@/components/UserAccess.vue';

@Component({
  components: {
      UserAccess,
  },
})
export default class Access extends Vue {}
</script>
