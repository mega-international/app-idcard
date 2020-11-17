<template>
  <section v-if="!loading['default'].loading" class="ViewItem pb-2">
    <!-- Overview -->
    <section class="info mt-4 mx-4 bg-white rounded-lg shadow-lg px-4 py-2">

      <div v-if="displayName" class="row"><label>{{ $t('text.name') }}</label><p>{{ technology.name }}</p></div>
      <div v-if="displayComment" class="row"><label>{{ $t('text.description') }}</label><p v-dompurify-html:clean="technology.comment"></p></div>
      <div v-if="displayId" class="row"><label>{{ 'ID' }}</label><p>{{ technology.id }}</p></div>
      <div v-if="displayCode" class="row"><label>{{ 'Code' }}</label><p>{{ technology.technologyCode }}</p></div>
      <div v-if="displayCompanyStandard" class="row"><label>{{ $t('text.companyStandard') }}</label><p>{{ technology.companyStandard }}</p></div>
      <div v-if="displayBeginLifeDate" class="row"><label>{{ $t('text.startDate') }}</label><p>{{ technology.beginLifeDate }}</p></div>
      <div v-if="displayEndLifeDate" class="row"><label>{{ $t('text.endDate') }}</label><p>{{ technology.endLifeDate }}</p></div>
    </section>

    <!-- Scope -->
    <details class="info mt-4 mx-4 bg-white rounded-lg shadow-lg">
      <summary>{{ $t('text.scope') }}</summary>
      <section class="mt-2 px-4">
        <header class="tabs">
          <nav>
            <button
              class="tab focus:outline-none"
              :class="scopeTab.scope === 0 ? 'active' : ''"
              @click="setScopeTab(0, 'scope')">{{ $t('text.types') }}</button>
          </nav>
        </header>
        <main class="divide-y-2 divide-gray-400 pb-2">
          <div v-if="scopeTab.scope === 0">
            <div v-for="type in technology.type" :key="type.name" class="mt-4 pt-2">
              <h1 class="title font-semibold">{{ type.name }}</h1>
            </div>
            <p v-if="!technology.type || !technology.type.length" class="no-data">{{ $t('text.noInfoToDisplay', { name: $t('text.types') }) }}</p>
          </div>
        </main>
      </section>
    </details>

      <!-- Usage -->
    <details class="info mt-4 mx-4 bg-white rounded-lg shadow-lg">
      <summary>{{ $t('text.application') }}</summary>
      <section class="mt-2 px-4">
        <header class="tabs">
          <nav>
            <button
              class="tab focus:outline-none"
              :class="scopeTab.application === 0 ? 'active' : ''"
              @click="setScopeTab(0, 'application')">{{ $t('text.usingApplications') }}</button>
          </nav>
        </header>
        <main class="divide-y-2 divide-gray-400 pb-2">
          <div v-if="scopeTab.application === 0">
            <div v-for="app in technology.application" :key="app.id">
              <router-link
                :to="{ path: `/view/applications/${app.id}` }"
                class="mt-4 inline-block font-semibold underline">
                  <span class="font-semibold">{{ app.name }}</span>
              </router-link>
            </div>
            <p v-if="!technology.application || !technology.application.length" class="no-data">{{ $t('text.noInfoToDisplay', { name: $t('text.usingApplications') }) }}</p>
          </div>
        </main>
      </section>
    </details>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ViewItem',
  components: {
  },
  data() {
    return {
      mounted: false,
      scopeTab: {
        scope: 0,
        application: 0
      },
    };
  },
  computed: {
    ...mapState({
      loading: (state) => state.spinner,
      technology: (state) => state.technology.technology,
      displayEmptyFields: 'displayEmptyFields',
    }),
    displayId() {
      return this.technology.id || (this.displayEmptyFields && !this.technology.id);
    },
    displayCode() {
      return this.technology.technologyCode || (this.displayEmptyFields && !this.technology.technologyCode);
    },
    displayName() {
      return this.technology.name || (this.displayEmptyFields && !this.technology.name);
    },
    displayComment() {
      return this.technology.comment || (this.displayEmptyFields && !this.technology.comment);
    },
    displayCompanyStandard() {
      return this.technology.companyStandard || (this.displayEmptyFields && !this.technology.companyStandard);
    },
    displayBeginLifeDate() {
      return this.technology.beginLifeDate || (this.displayEmptyFields && !this.technology.beginLifeDate);
    },
    displayEndLifeDate() {
      return this.technology.endLifeDate || (this.displayEmptyFields && !this.technology.endLifeDate);
    }
  },
  async mounted() {
    const tech = await this.$store.dispatch('getTechnology', {
      id: this.$route.params.id
    });

    if (tech === 'ECONNABORTED') {
      this.$store.commit('showSpinner');
      const interval = setInterval(async () => {
        const data = await this.$store.dispatch('asyncGetApplication');
        if (data !== 'ECONNABORTED' && data !== false) {
          this.$store.commit('hideSpinner');
          this.$store.commit('setViewOutleTitle', this.technology.name);
          clearInterval(interval);
        }
      }, 3000);
      return false;
    }

    this.$store.commit('setViewOutleTitle', this.technology.name);
    return this.$store.commit('hideSpinner');
  },
  async activated() {
    if (this.mounted) {
      await this.$store.dispatch('getTechnology', {
        id: this.$route.params.id
      });
      this.$store.commit('setViewOutleTitle', this.technology.name);
      this.$store.commit('hideSpinner');
    }
    this.mounted = true;
  },
  methods: {
    setScopeTab(value, key) {
      this.scopeTab[key] = value;
    }
  }
};
</script>

<style scoped>
a:hover {
  @apply text-green;
}
</style>
