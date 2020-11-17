<template>
  <section id="search-container" class="Search absolute inset-y-0 pt-12 overflow-visible flex flex-col w-full">
    <header class="pt-4 px-4">
      <!-- Search input -->
      <form class="flex justify-between items-center" @submit.prevent="handleSearch(true)">
        <label class="form-control block relative flex-1">
          <button class="icon absolute left-0 top-0 bottom-0 ml-1 flex items-center justify-center z-10" @click="handleSearch(true)">
            <lit-icon class="text-green" icon="search" iconset="outlet"></lit-icon>
          </button>
          <ho-input
            v-model="searchInput"
            :placeholder="$t('text.search')"
            type="search"
            @input="handleSearch()"></ho-input>
        </label>
        <button
          v-show="search.length" class="focus:outline-none" type="button"
          @click="resetSearch"><lit-icon icon="close" iconset="search"></lit-icon></button>
      </form>
    </header>
    <main id="scroll-ctn" class="mt-4 relative h-full overflow-y-scroll">
      <!-- Keep alive allow us to conserve dynamic rendered view, so we change page, the view component is not destroyed -->
      <keep-alive>
        <!-- Application tab -->
        <transition-group name="slide" mode="out-in" class="block relative h-full">
          <div v-show="tab === 'applications'" key="applications" class="w-full h-full">
            <!-- Search results -->
            <tab-content
              v-if="displaySearchOrRecentlyViewedApp"
              tab="applications"
              :data="applicationsResults"
              class="tab">
            </tab-content>
            <!-- Recently viewed -->
            <section
              v-else
              class="last-viewed-apps">
              <header class="pt-4 px-4"><h1 class="font-bold">{{ $t('text.lastViewedApp') }}</h1></header>
              <main class="pt-4 px-4">
                <item-card
                  v-for="item in lastViewedApp"
                  :key="`application-${item.id}`"
                  class="shadow-lg rounded-lg"
                  :tab="tab"
                  :item="item"
                  ></item-card>
              </main>
            </section>
          </div>
          <!-- Technology tab -->
          <div v-show="tab !== 'applications'" key="technologies" class="w-full h-full">
            <!-- Search result -->
            <tab-content
              v-if="displaySearchOrRecentlyViewedTech"
              tab="technologies"
              :data="technologiesResults"
              class="tab">
            </tab-content>
            <!-- Recently viewed -->
            <section
              v-else
              class="last-viewed-apps">
              <header class="pt-4 px-4"><h1 class="font-bold">{{ $t('text.lastViewedTech') }}</h1></header>
              <main class="pt-4 px-4">
                <item-card
                  v-for="item in lastViewedTech"
                  :key="`technology-${item.id}`"
                  class="shadow-lg rounded-lg"
                  :tab="tab"
                  :item="item"
                  ></item-card>
              </main>
            </section>
          </div>
        </transition-group>
      </keep-alive>
      <ho-spinner class-name="absolute inset-0 z-50" name="search"></ho-spinner>
    </main>
    <lit-iconset iconset="search">
      <svg><defs>
        <g id="close"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g>
      </defs></svg>
    </lit-iconset>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import HoSpinner from '@/components/layout/loader/ho-spinner.vue';
import HoInput from '../components/form/input/text/ho-input.vue';
import TabContent from '../components/layout/tabs/tab-content.vue';
import ItemCard from '../components/layout/cards/item-card.vue';
import tabMixin from '../mixin/tab.js';
import stickyHeaderMixin from '../mixin/stickyHeader.js';
import fuseMixin from '../mixin/fuse.js';

export default {
  name: 'Search',
  components: {
    HoInput,
    TabContent,
    HoSpinner,
    ItemCard
  },
  mixins: [ tabMixin, stickyHeaderMixin, fuseMixin ],
  data() {
    return {
      isInitResultPopulated: false,
      search: '',
      appSearchResult: [],
      techSearchResult: []
    };
  },
  computed: {
    ...mapState({ applications: (state) => state.application.applications }),
    ...mapState({ technologies: (state) => state.technology.technologies }),
    ...mapState({ lastViewedApp: (state) => state.application.lastViewedApp }),
    ...mapState({ lastViewedTech: (state) => state.technology.lastViewedTech }),
    applicationsResults() {
      const tempSearchResult = [ ...(this.appSearchResult || []) ];
      if (!tempSearchResult.length) {
        this.$store.commit('hideSpinner', 'search');
        return [];
      }
      const searchNav = [];
      const results = Object.values(
        tempSearchResult.reduce((acc, application) => {
          const accumulateur = acc;
          const firstLetter = application.name[0].toLocaleUpperCase();
          if (!accumulateur[firstLetter]) {
            searchNav.push(firstLetter);
            accumulateur[firstLetter] = { letter: firstLetter, items: [ application ] };
          } else {
            accumulateur[firstLetter].items.push(application);
          }
          return accumulateur;
        }, {})
      );
      this.$store.commit('setSearchNav', searchNav);
      this.$store.commit('hideSpinner', 'search');
      return results;
    },
    technologiesResults() {
      const tempSearchResult = [ ...(this.techSearchResult || []) ];
      if (!tempSearchResult.length) {
        this.$store.commit('hideSpinner', 'search');
        return [];
      }
      const searchNav = [];
      const results = Object.values(
        tempSearchResult.reduce((acc, technology) => {
          const accumulateur = acc;
          const firstLetter = technology.name[0].toLocaleUpperCase();
          if (!accumulateur[firstLetter]) {
            searchNav.push(firstLetter);
            accumulateur[firstLetter] = { letter: firstLetter, items: [ technology ] };
          } else {
            accumulateur[firstLetter].items.push(technology);
          }
          return accumulateur;
        }, {})
      );

      this.$store.commit('setSearchNav', searchNav);
      this.$store.commit('hideSpinner', 'search');
      return results;
    },
    searchInput: {
      set(value) {
        if (this.search !== value) {
          this.search = value;
        }
      },
      get() {
        return this.$store.state.route.query.q;
      }
    },
    displaySearchOrRecentlyViewedApp() {
      return this.isInitResultPopulated || !this.lastViewedApp.length;
    },
    displaySearchOrRecentlyViewedTech() {
      return this.isInitResultPopulated || !this.lastViewedTech.length;
    }
  },
  watch: {
    tab() {
      document.querySelector('#search-container').scrollIntoView({
        block: 'start'
      });
      this.resetSearch();

      const shouldInit = (this.tab === 'applications' && !this.applicationsResults.length) || (this.tab !== 'applications' && !this.technologiesResults.length);
      if (shouldInit) {
        return this.initView();
      }
      return this.$store.commit('hideSpinner');
    },
    isInitResultPopulated() {
      if (this.isInitResultPopulated && this.search.length > 2) {
        this.handleSearch();
      }
    },
    search() {
      if (this.search.length <= 2) {
        this.isInitResultPopulated = false;
      }
    }
  },
  async mounted() {
    // Redirect to application tab if no defined in URL
    if (!this.$route.query.tab) this.$router.replace({ name: this.$route.name, query: { tab: 'applications' } });

    document.addEventListener('sticky-change', (e) => {
      const [ header, stuck ] = [ e.detail.target, e.detail.stuck ];
      header.classList.toggle('shadow-lg', stuck);
      const event = new CustomEvent('change-section', { detail: { header, stuck } });
      document.dispatchEvent(event);
    });

    // Move all the init behaviour to a separate method so we can call it on tab change
    await this.initView();
  },
  activated() {
    this.searchInput = this.$store.state.route.query.q || '';
    this.$store.commit('hideSpinner');
  },
  methods: {
    async initView() {
      // If no past viewed items, get an empty search
      if (this.tab === 'applications') {
        await this.$store.dispatch('getLastViewedApplication');
      } else {
        await this.$store.dispatch('getLastViewedTechnology');
      }

      // If the use has already made a search, and can back from a sub result page
      // Then we relaunch the search with the last query typed
      //
      // If there is no past search, we check if the user has already viewed some content,
      // if no so, we trigger an empty search to retrieve everything
      if (this.searchInput) {
        this.$store.commit('showSpinner', 'search');
        const data = await this.$store.dispatch(this.tab === 'applications' ? 'searchApplication' : 'searchTechnology', {
          criteria: this.searchInput
        });
        if (data === 'ECONNABORTED') {
          this.$store.commit('showSpinner', 'search');
          if (this.tab === 'applications') {
            this.asyncSearchApplication();
          } else {
            this.asyncSearchTechnology();
          }
          return false;
        }
        if (data) {
          this.isInitResultPopulated = true;
          if (this.tab === 'applications') {
            this.appSearchResult = data;
          } else {
            this.techSearchResult = data;
          }
        }
        const container = document.querySelector('#scroll-ctn');
        if (container) {
          this.$nextTick(() => {
            this.observeStickyHeaderChanges(container);
          });
        }
      }
      return this.$store.commit('hideSpinner');
    },
    resetSearch() {
      this.search = '';
      this.$router.replace({ query: { ...this.$route.query, ...(this.search ? { q: this.search } : { q: undefined }) } });
      this.searchInput = '';

      // Do not trigger a new search
      // this.handleSearch();
      this.appSearchResult = [];
      this.techSearchResult = [];
      this.$store.commit('hideSpinner');
    },

    async handleSearch(forceSearch = false) {
      if (this.search === '') {
        return this.resetSearch();
      }
      // FIXME: The search in past results seems not to be working when the user came back from applications/technologies view
      const type = this.tab;

      // Sync url with the search input, so we can get back to the previous search when the user return back
      // NOTE: Pentential performence issue do to Vue dev tools :/
      //       To offthread, the update of the URL, use setTimeout
      setTimeout(() => {
        this.$router.replace({ query: { ...this.$route.query, ...(this.search ? { q: this.search } : { q: undefined }) } });
      }, 200);

      // Display the search sub spinner while waiting the result of the Graphql query
      this.$store.commit('showSpinner', 'search');

      // We make a pre request when the use type 3 charaters
      // So we can get a pre filtered resultset
      // Forces the search by manualy submitting the form
      // To prevent us from getting too much result we only forcesearch with at least  characters
      if (this.search.length === 3 || (forceSearch && this.search.length >= 1)) {
        const data = await this.$store.dispatch(this.tab === 'applications' ? 'searchApplication' : 'searchTechnology', {
          criteria: this.search
        });

        if (data === 'ECONNABORTED') {
          if (this.tab === 'applications') {
            this.asyncSearchApplication();
          } else {
            this.asyncSearchTechnology();
          }
          return false;
        }

        // We save this first resultset in an array that will be filtered
        // by Fuse.js
        if (type === 'applications') {
          this.appSearchResult = this[type];
        } else {
          this.techSearchResult = this[type];
        }

        // As the use tape in the in search input, it'll trigger this method
        // We need to figure out if we already have a resultset to search in or not
        this.isInitResultPopulated = true;
        if (data === false) {
          // FIXME: Display error toast
          console.log('[mega] An error happen !');
        }
      } else if (this.isInitResultPopulated && this.search.length >= 3) {
        this.$store.commit('showSpinner', 'search');

        // Retrieve from Fuze mixin, two fuse instance
        // One for each query type
        const searchType = {
          applications: this.initApplicationSearch.bind(this),
          technologies: this.initTechnologySearch.bind(this)
        };
        const stateType = {
          applications: 'searchApplication',
          technologies: 'searchTechnology'
        };

        // Pass the current resultset type to fuse in order to perfome a fuzzy search
        const searchInstance = searchType[type](this[type]);

        /**
         * Use advenced search option to match perfect pattern
         * @see https://github.com/krisk/Fuse/issues/428
         * @see https://fusejs.io/examples.html#extended-search
         */
        const fusyResult = searchInstance.search(`'${this.search}`);

        // highlight result matches
        fusyResult.forEach(this.highlighter);

        if (type === 'applications') {
          this.appSearchResult = fusyResult.map((res) => res.item);
        } else {
          this.techSearchResult = fusyResult.map((res) => res.item);
        }
      } else if (this.search === '') {
        this.$store.commit('hideSpinner');
      }
      return true;
    },

    highlighter(result) {
      result.matches.forEach((item) => {
        const text = result.item[item.key];
        // const div = document.createElement('div');
        // div.innerHTML = rawText;
        // const text = div.textContent;
        const matches = [].concat(item.indices);
        let pair = matches.shift();

        const results = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < text.length; i++) {
          const char = text.charAt(i);
          if (pair && i === pair[0]) {
            results.push('<b class="highlighted">');
          }
          results.push(char);
          if (pair && i === pair[1]) {
            results.push('</b>');
            pair = matches.shift();
          }
        }
        // eslint-disable-next-line no-param-reassign
        result.item.matches = {} || result.item.matches;
        // eslint-disable-next-line no-param-reassign
        result.item.matches[item.key] = results.join('');
      });
    },
    asyncSearchApplication() {
      const interval = setInterval(async () => {
        const data = await this.$store.dispatch('asyncSearchApplication');
        if (data !== 'ECONNABORTED' && data !== false) {
          this.isInitResultPopulated = true;
          this.appSearchResult = data;
          this.$store.commit('hideSpinner');
          clearInterval(interval);
        }
      }, 3000);
    },
    asyncSearchTechnology() {
      const interval = setInterval(async () => {
        const data = await this.$store.dispatch('asyncSearchTechnology');
        if (data !== 'ECONNABORTED' && data !== false) {
          this.isInitResultPopulated = true;
          this.techSearchResult = data;
          this.$store.commit('hideSpinner');
          clearInterval(interval);
        }
      }, 3000);
    }
  },
};
</script>

<style scoped>
.tab {
}
</style>
<style>
.ho-input input {
  @apply pl-10;
}
</style>
