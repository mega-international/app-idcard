<template>
  <section class="tab-content w-full">
    <section v-if="!data.length" class="px-4 h-full">
      <img class="mt-6 w-4/6 lg:w-1/6 mx-auto" src="@/assets/img/search.svg" alt="Search illustration">
      <h1 class="mt-4 font-bold text-center">{{ $t('text.searchFor', { tab }) }}</h1>
    </section>
    <section v-else class="flex">
      <section class="tab-ctn px-4 pb-4 flex-1">
        <main class="w-full">
          <ul>
            <alpha-card
              v-for="item in data" :key="`letter-${item.letter}`"
              class="mt-4 first:mt-0"
              :letter="item.letter">
              <item-card
                v-for="result in item.items" :key="result.id"
                :tab="tab"
                :item="result">
              </item-card>
            </alpha-card>
          </ul>
        </main>
      </section>
      <aside class="asbolute right-0 w-8">
        <div class="sticky top-0 z-40">
          <range-nav></range-nav>
        </div>
      </aside>
    </section>
  </section>
</template>

<script>
import RangeNav from '../range-nav.vue';
import AlphaCard from '../cards/alpah-card.vue';
import itemCard from '../cards/item-card.vue';

export default {
  name: 'TabContent',
  components: {
    RangeNav,
    AlphaCard,
    itemCard
  },
  props: {
    tab: String,
    title: String,
    data: Array
  }
};
</script>

<style>
/* https://app.contrast-finder.org/result.html?foreground=A2ACBA&background=%23F4D766&ratio=4.5&isBackgroundTested=false&algo=Rgb&lang=en */
.tab-content .highlighted {
  background-color: #F4D766;
  color: #54606F;
  @apply font-bold;
}
</style>
