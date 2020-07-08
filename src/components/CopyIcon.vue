<template>
  <button type="button" class="btn btn-sm" v-clipboard:copy="text">
    <font-awesome-icon icon="copy">
    </font-awesome-icon>
  </button>
</template>

<script>
  export default {
    name: 'copyIcon',
    props: ['text']
  };
</script>

<style lang="scss" scoped>
  @import "../colours.scss";
</style>
