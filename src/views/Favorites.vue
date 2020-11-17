<template>
  <section class="Favorites absolute inset-y-0 pt-12 overflow-visible flex flex-col w-full">
    <main class="tab-container overflow-y-auto h-full">
      <!-- Favorite applications and technologies tabs -->
      <div v-if="isFavorites" key="container" class="w-full h-full">
        <transition-group name="slide" mode="out-in" class="block relative h-full">
          <!-- Applications -->
          <div v-if="tab === 'applications'" key="applications" class="applications h-full">
            <section class="mt-4 px-4 pb-4">
              <h1 class="text-xl font-bold">{{ $t('text.favorites') }}</h1>
              <main class="mt-4">
                <item-card
                  v-for="item in applications"
                  :key="`application-${item.id}`"
                  class="shadow-lg rounded-lg"
                  :tab="tab"
                  :item="item"
                  ></item-card>
              </main>
            </section>
          </div>
          <!-- Technologies -->
          <div v-else key="technologies" class="technologies h-full">
            <section class="mt-4 px-4 pb-4">
              <h1 class="text-xl font-bold">{{ $t('text.favorites') }}</h1>
              <main class="mt-4">
                <item-card
                  v-for="item in technologies"
                  :key="`application-${item.id}`"
                  class="shadow-lg rounded-lg"
                  :tab="tab"
                  :item="item"
                  ></item-card>
              </main>
            </section>
          </div>
        </transition-group>
      </div>
      <!-- No favorites -->
      <div v-else class="h-full flex justify-center items-center">
        <div class="w-5/6 lg:w-2/6 mx-auto">
          <star-icon class="w-1/2 mx-auto text-gray-300"></star-icon>
          <div class="text-center">
            <div class="text-lg">{{ $t('text.noFavorites') }}</div>
            <p class="mt-2 text-sm text-light-grey-500">{{ $t('text.addToFavoritesComment') }}</p>
            <router-link :to="{ name: 'Search', query: { tab } }" class="mt-4 flex justify-center items-center focus:outline-none bg-magenta rounded-lg text-white font-bold px-4 -py-3 text-xl h-12">{{ $t('text.search') }}</router-link>
          </div>
        </div>
      </div>
    </main>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import tabMixin from '../mixin/tab.js';
import ItemCard from '../components/layout/cards/item-card.vue';
import StarIcon from '../components/icon/star.vue';

export default {
  name: 'Favorites',
  components: {
    ItemCard,
    StarIcon
  },
  mixins: [ tabMixin ],
  computed: {
    ...mapState({ applications: (state) => state.application.favorites }),
    ...mapState({ technologies: (state) => state.technology.favorites }),
    isFavorites() {
      return (this.tab === 'applications' && this.applications.length) || (this.tab !== 'applications' && this.technologies.length);
    }
  },
  watch: {
    tab() {
      this.initView();
    }
  },
  async mounted() {
    // Redirect to application tab if no defined in URL
    if (!this.$route.query.tab) this.$router.replace({ name: this.$route.name, query: { tab: 'applications' } });

    await this.initView();
  },
  async activated() {
    await this.initView();
  },
  methods: {
    async initView() {
      if (this.tab === 'applications') {
        await this.$store.dispatch('getFavoriteApplications');
      } else {
        await this.$store.dispatch('getFavoriteTechnologies');
      }
      this.$store.commit('hideSpinner');
    },
  }
};
</script>

<style scoped>

</style>
