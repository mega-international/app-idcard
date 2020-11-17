<template>
  <router-link
    :to="{ path: `/view/${tab}/${item.id}` }"
    class="block bg-white mt-4 first:mt-0 px-4 py-3">
    <h1 v-dompurify-html:clean="isSearch && item.matches.name ? item.matches.name : item.name" class="font-bold text-light-grey-500 text-lg"></h1>
    <h2 v-if="code" class="mt-2 text-light-grey-500 text-base">{{ $t('text.code') }} : {{ code }}</h2>
    <p
      v-dompurify-html:clean="isSearch && item.matches.comment ? item.matches.comment : item.comment"
      class="mt-2 raw-text"></p>
  </router-link>
</template>

<script>
export default {
  name: 'item-card',
  props: {
    tab: String,
    item: Object
  },
  computed: {
    code() {
      return this.item.applicationCode || this.item.technologyCode;
    },
    isSearch() {
      return this.$route.name === 'Search' && this.item.matches;
    }
  }
};
</script>

<style scoped>
.raw-text,
.raw-text * {
  @apply text-xs text-light-grey-400 !important;
}
</style>
