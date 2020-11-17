<template>
  <section v-if="!loading['default'].loading" class="ViewItem pb-2">
    <!-- FIXME: Get the last assessmenet date from API -->
    <section class="mt-4 mx-4 bg-white rounded-lg shadow-lg px-4 py-2">
      <h1 v-if="displayLastAssessmentDate" class="mt-2"><span class="font-bold">{{ $t('text.lastAssessmentDate') }} :</span> {{ application.lastAssessmentDate | dateShort }}</h1>
      <section class="tiles mt-4 grid grid-cols-2 gap-2">
        <value-card
          v-if="application.businessValueAPM"
          :value="application.businessValueAPM"
          :title="$t('text.BusinessValue')"></value-card>
        <value-card
          v-if="application.functionalSupportAPM"
          :value="application.functionalSupportAPM"
          :title="$t('text.FunctionalSupport')"></value-card>
        <value-card
          v-if="application.technicalEfficiencyAPM"
          :value="application.technicalEfficiencyAPM"
          :title="$t('text.TechnicalEfficiency')"></value-card>
        <value-card
          v-if="application.technologyCompliance"
          :value="application.technologyCompliance"
          :title="$t('text.technologyCompliance')"></value-card>
      </section>
    </section>

    <!-- Overview -->
    <section class="info mt-4 mx-4 bg-white rounded-lg shadow-lg px-4 py-2">
      <div v-if="displayName" class="row first:mt-0"><label>{{ $t('text.name') }}</label><p>{{ application.name }}</p></div>
      <div v-if="displayComment" class="row"><label>{{ $t('text.description') }}</label><p v-dompurify-html:clean="application.comment"></p></div>
      <div v-if="displayId" class="row"><label>{{ 'ID' }}</label><p>{{ application.id }}</p></div>
      <div v-if="displayCode" class="row"><label>{{ 'Code' }}</label><p>{{ application.applicationCode }}</p></div>
      <div v-if="displayVersion" class="row"><label>{{ $t('text.version') }}</label><p>{{ application.versionNumber }}</p></div>
      <div v-if="displayType" class="row"><label>{{ $t('text.type') }}</label><p>{{ application.applicationType }}</p></div>
      <div v-if="displayHosting" class="row"><label>{{ $t('text.hosting') }}</label><p>{{ application.cloudComputing }}</p></div>
      <div v-if="displayApplicationOwner" class="row">
        <label>{{ $t('text.applicationOwner') }}</label>
        <div>
          <span v-for="owner in application.applicationOwner_PersonSystem" :key="owner.name" class="flex items-center">
            <lit-icon class="text-green" icon="user" iconset="view"></lit-icon>
            <div>
              <div>{{ owner.name }}</div>
              <div class="text-xs font-normal">{{ owner.email }}</div>
            </div>
          </span>
        </div>
      </div>
      <div v-if="displayNumberUser" class="row"><label>{{ $t('text.numberOfUsers') }}</label><p>{{ application.currentNumberOfUsers }}</p></div>
      <div v-if="displayBeginLifeDate" class="row"><label>{{ $t('text.startDate') }}</label><p>{{ application.beginLifeDate }}</p></div>
      <div v-if="displayEndLifeDate" class="row"><label>{{ $t('text.endDate') }}</label><p>{{ application.endLifeDate }}</p></div>
      <div v-if="displayPortfolio" class="row">
        <label>{{ $t('text.Portfolio') }}</label>
        <p v-for="initiative in application.initiative" :key="JSON.stringify(initiative)">
          <span v-for="portfolio in initiative.portfolio" :key="JSON.stringify(portfolio)">{{ portfolio.name }}</span>
        </p>
      </div>
      <div v-if="displayPortfolioOwner" class="row">
        <label>{{ $t('text.PortfolioOwner') }}</label>
        <p v-for="initiative in application.initiative" :key="JSON.stringify(initiative)">
          <span v-for="portfolio in initiative.portfolio" :key="JSON.stringify(portfolio)">
            <span v-for="person in portfolio.portfolioManager_PersonSystem" :key="JSON.stringify(person)" class="flex items-center">
              <lit-icon class="text-green" icon="user" iconset="view"></lit-icon>
              <div>
                <div>{{ person.name }}</div>
                <div class="text-xs font-normal">{{ person.email }}</div>
              </div>
            </span>
          </span>
        </p>
      </div>
    </section>

    <!-- Scope -->
    <details class="info mt-4 mx-4 bg-white rounded-lg shadow-lg">
      <summary>{{ $t('text.scope') }}</summary>
      <section class="mt-2 px-4">
        <header class="tabs">
          <nav>
            <div class="inline-block">
              <button
                class="tab focus:outline-none"
                :class="scopeTab.scope === 0 ? 'active' : ''"
                @click="setScopeTab(0, 'scope')">{{ $t('text.capabilities') }}</button>
            </div>
            <div class="inline-block">
              <button
                class="tab focus:outline-none"
                :class="scopeTab.scope === 1 ? 'active' : ''"
                @click="setScopeTab(1, 'scope')">{{ $t('text.functionalities') }}</button>
            </div>
            <div class="inline-block">
              <button
                class="tab focus:outline-none"
                :class="scopeTab.scope === 2 ? 'active' : ''"
                @click="setScopeTab(2, 'scope')">{{ $t('text.processes') }}</button>
            </div>
            <div class="inline-block">
              <button
                class="tab focus:outline-none"
                :class="scopeTab.scope === 3 ? 'active' : ''"
                @click="setScopeTab(3, 'scope')">{{ $t('text.usedTechnologies') }}</button>
            </div>
          </nav>
        </header>
        <main class="divide-y-2 divide-gray-400 pb-2">
          <div v-if="scopeTab.scope === 0">
            <div v-for="capability in application.businessCapability" :key="capability.name" class="mt-4 pt-2">
              <h1 class="title font-semibold">{{ capability.name }}</h1>
              <p v-dompurify-html:clean="capability.comment" class="no-data"></p>
            </div>
            <p v-if="!application.businessCapability || !application.businessCapability.length" class="no-data">{{ $t('text.noInfoToDisplay', { name: $t('text.capabilities') }) }}</p>
          </div>
          <div v-if="scopeTab.scope === 1">
            <div v-for="fn in application.functionality" :key="fn.name" class="mt-4 pt-2">
              <h1 class="title font-semibold">{{ fn.name }}</h1>
              <p v-dompurify-html:clean="fn.comment" class="no-data"></p>
            </div>
            <p v-if="!application.functionality || !application.functionality.length" class="no-data">{{ $t('text.noInfoToDisplay', { name: $t('text.functionnalities') }) }}</p>
          </div>
          <div v-if="scopeTab.scope === 2">
            <div v-for="process in application.businessProcess" :key="process.name" class="mt-4 pt-2">
              <h1 class="title font-semibold">{{ process.name }}</h1>
              <p v-dompurify-html:clean="process.comment" class="no-data"></p>
            </div>
            <p v-if="!application.businessProcess || !application.businessProcess.length" class="no-data">{{ $t('text.noInfoToDisplay', { name: $t('text.processes') }) }}</p>
          </div>
          <div v-if="scopeTab.scope === 3">
            <router-link
              v-for="softwareTechnology in application.softwareTechnology_UsedTechnology"
              :key="softwareTechnology.id"
              :to="{ path: `/view/technologies/${softwareTechnology.id}` }"
              class="mt-4 block font-semibold underline">{{ softwareTechnology.name }}</router-link>
            <p v-if="!application.softwareTechnology_UsedTechnology || !application.softwareTechnology_UsedTechnology.length" class="no-data">{{ $t('text.noInfoToDisplay', { name: $t('text.usedTechnologies') }) }}</p>
          </div>
        </main>
      </section>
    </details>

    <!-- Responsibilities -->
    <details class="info mt-4 mx-4 bg-white rounded-lg shadow-lg">
      <summary>{{ $t('text.responsibilities') }}</summary>
      <section class="mt-2 px-4">
        <header class="tabs">
          <nav>
            <div class="inline-block">
              <button
                class="tab focus:outline-none"
                :class="scopeTab.responsibilities === 0 ? 'active' : ''"
                @click="setScopeTab(0, 'responsibilities')">{{ $t('text.businessOwner') }}</button>
            </div>
            <div class="inline-block">
              <button
                class="tab focus:outline-none"
                :class="scopeTab.responsibilities === 1 ? 'active' : ''"
                @click="setScopeTab(1, 'responsibilities')">{{ $t('text.itOwner') }}</button>
            </div>
            <div class="inline-block">
              <button
                class="tab focus:outline-none"
                :class="scopeTab.responsibilities === 2 ? 'active' : ''"
                @click="setScopeTab(2, 'responsibilities')">{{ $t('text.softwareDesigner') }}</button>
            </div>
            <div class="inline-block">
              <button
                class="tab focus:outline-none"
                :class="scopeTab.responsibilities === 3 ? 'active' : ''"
                @click="setScopeTab(3, 'responsibilities')">{{ $t('text.localFinancialController') }}</button>
            </div>
          </nav>
        </header>
        <main class="divide-y-2 divide-gray-400 pb-2">
          <div v-if="scopeTab.responsibilities === 0">
            <div v-for="businessOwner in application.businessOwner_PersonSystem" :key="businessOwner.name" class="mt-4 pt-2">
              <span class="title font-semibold flex items-center">
                <lit-icon class="text-green" icon="user" iconset="view"></lit-icon>
                <div>
                  <div>{{ businessOwner.name }}</div>
                  <div class="text-xs font-normal">{{ businessOwner.email }}</div>
                </div>
              </span>
            </div>
            <p v-if="!application.businessOwner_PersonSystem || !application.businessOwner_PersonSystem.length" class="no-data">{{ $t('text.noInfoToDisplay', { name: $t('text.businessOwner') }) }}</p>
          </div>
          <div v-if="scopeTab.responsibilities === 1">
            <div v-for="iTOwner in application.iTOwner_PersonSystem" :key="iTOwner.name" class="mt-4 pt-2">
              <span class="title font-semibold flex items-center">
                <lit-icon class="text-green" icon="user" iconset="view"></lit-icon>
                <div>
                  <div>{{ iTOwner.name }}</div>
                  <div class="text-xs font-normal">{{ iTOwner.email }}</div>
                </div>
              </span>
            </div>
            <p v-if="!application.iTOwner_PersonSystem || !application.iTOwner_PersonSystem.length" class="no-data">{{ $t('text.noInfoToDisplay', { name: $t('text.itOwner') }) }}</p>
          </div>
          <div v-if="scopeTab.responsibilities === 2">
            <div v-for="softwareDesigner in application.softwareDesigner_PersonSystem" :key="softwareDesigner.name" class="mt-4 pt-2">
              <span class="title font-semibold flex items-center">
                <lit-icon class="text-green" icon="user" iconset="view"></lit-icon>
                <div>
                  <div>{{ softwareDesigner.name }}</div>
                  <div class="text-xs font-normal">{{ softwareDesigner.email }}</div>
                </div>
              </span>
            </div>
            <p v-if="!application.softwareDesigner_PersonSystem || !application.softwareDesigner_PersonSystem.length" class="no-data">{{ $t('text.noInfoToDisplay', { name: $t('text.softwareDesigner') }) }}</p>
          </div>
          <div v-if="scopeTab.responsibilities === 3">
            <div v-for="localFinancialController in application.localFinancialController" :key="localFinancialController.name" class="mt-4 pt-2">
              <span class="title font-semibold flex items-center">
                <lit-icon class="text-green" icon="user" iconset="view"></lit-icon>
                <div>
                  <div>{{ localFinancialController.name }}</div>
                  <div class="text-xs font-normal">{{ localFinancialController.email }}</div>
                </div>
              </span>
            </div>
            <p v-if="!application.localFinancialController || !application.localFinancialController.length" class="no-data">{{ $t('text.noInfoToDisplay', { name: $t('text.localFinancialController') }) }}</p>
          </div>
        </main>
      </section>
    </details>

    <!-- Usage -->
    <details class="info mt-4 mx-4 bg-white rounded-lg shadow-lg">
      <summary>{{ $t('text.usage') }}</summary>
      <section class="mt-2 px-4">
        <header class="tabs">
          <button
            class="tab focus:outline-none"
            :class="scopeTab.usage === 0 ? 'active' : ''"
            @click="setScopeTab(0, 'usage')">{{ $t('text.softwareInstallation') }}</button>
        </header>
        <main class="divide-y-2 divide-gray-400 pb-2">
          <div v-if="scopeTab.usage === 0">
            <div v-for="softwareInstallation in application.softwareInstallation" :key="softwareInstallation.name" class="mt-4 pt-2 bg-light-grey-400 bg-opacity-10 p-2 rounded-lg">
              <h1 class="title font-bold text-xl">{{ softwareInstallation.name }}</h1>
              <!-- Servers -->
              <div v-if="softwareInstallation.serverDeployed_DeploymentSupport.length" class="usage-row">
                <div class="col-1"><img class="img-icon" :src="servIcon" alt="servIcon"></div>
                <div class="col-2">
                  <h2 class="title font-semibold">{{ $t('text.servers') }} : </h2>
                  <p class="ml-2">{{ softwareInstallation.serverDeployed_DeploymentSupport.map((server) => server.name).join(', ') }}</p>
                </div>
              </div>
              <!-- Sites -->
              <div v-if="softwareInstallation.site_DeploymentSupport.length" class="usage-row">
                <div class="col-1"><img class="img-icon" :src="siteIcon" alt="siteIcon"></div>
                <div class="col-2">
                  <h2 class="title font-semibold">{{ $t('text.sites') }} :</h2>
                  <p class="ml-2">{{ softwareInstallation.site_DeploymentSupport.map((site) => site.name).join(', ') }}</p>
                </div>
              </div>
              <!-- Usages -->
              <div class="usage-row">
                <div class="col-1"><img class="img-icon" :src="orgusIcon" alt="orgusIcon"></div>
                <div class="col-2">
                  <div>
                    <h2 v-if="softwareInstallation.usageContext_ApplicationDeploymentContext.length" class="title font-semibold">{{ $t('text.usages') }} :</h2>
                    <div>
                      <div v-for="usage in softwareInstallation.usageContext_ApplicationDeploymentContext" :key="usage.name" class="mt-2 usage-row">
                        <div>
                          <label class="title font-semibold">{{ usage.name }} :</label>
                          <p>{{ usage.numberOfUsers }} {{ $t('text.users') }}</p>
                        </div>
                        <span v-if="usage.orgUnit_DeploymentUser.length" class="flex-1 ml-2">{{ usage.orgUnit_DeploymentUser.map((org) => org.name).join(', ') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="!application.softwareInstallation || !application.softwareInstallation.length" class="no-data">{{ $t('text.noInfoToDisplay', { name: $t('text.softwareInstallation') }) }}</p>
          </div>
        </main>
      </section>
    </details>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import site from '@/assets/img/icons/site.png';
import serv from '@/assets/img/icons/serv.png';
import orgus from '@/assets/img/icons/orgus.png';
import ValueCard from '../components/layout/cards/value-card.vue';

export default {
  name: 'ViewItem',
  components: {
    ValueCard
  },
  data() {
    return {
      mounted: false,
      scopeTab: {
        scope: 0,
        responsibilities: 0,
        usage: 0
      },
    };
  },
  computed: {
    siteIcon: () => site,
    servIcon: () => serv,
    orgusIcon: () => orgus,
    ...mapState({
      loading: (state) => state.spinner,
      application: (state) => state.application.application,
      displayEmptyFields: 'displayEmptyFields',
    }),
    displayLastAssessmentDate() {
      return this.application.lastAssessmentDate || (this.displayEmptyFields && !this.application.lastAssessmentDate);
    },
    displayId() {
      return this.application.id || (this.displayEmptyFields && !this.application.id);
    },
    displayCode() {
      return this.application.applicationCode || (this.displayEmptyFields && !this.application.applicationCode);
    },
    displayName() {
      return this.application.name || (this.displayEmptyFields && !this.application.name);
    },
    displayComment() {
      return this.application.comment || (this.displayEmptyFields && !this.application.comment);
    },
    displayVersion() {
      return this.application.versionNumber || (this.displayEmptyFields && !this.application.versionNumber);
    },
    displayType() {
      return this.application.applicationType || (this.displayEmptyFields && !this.application.applicationType);
    },
    displayHosting() {
      return this.application.cloudComputing || (this.displayEmptyFields && !this.application.cloudComputing);
    },
    displayPortfolio() {
      return this.application.initiative && this.application.initiative.length > 0;
    },
    // FIXME: Find a way to display only labels because we get an error when accessing undefined value
    displayPortfolioOwner() {
      return this.application.initiative && this.application.initiative.length > 0 && this.application.initiative[0].portfolio[0].portfolioManager_PersonSystem.length > 0;
    },
    // FIXME: Find a way to display only labels because we get an error when accessing undefined value
    displayApplicationOwner() {
      return this.application.applicationOwner_PersonSystem || (this.displayEmptyFields && this.application.applicationOwner_PersonSystem);
    },
    displayNumberUser() {
      return Number.isInteger(this.application.currentNumberOfUsers) || (this.displayEmptyFields && !Number.isInteger(this.application.currentNumberOfUsers));
    },
    displayBeginLifeDate() {
      return this.application.beginLifeDate || (this.displayEmptyFields && !this.application.beginLifeDate);
    },
    displayEndLifeDate() {
      return this.application.endLifeDate || (this.displayEmptyFields && !this.application.endLifeDate);
    }
  },
  async mounted() {
    const app = await this.$store.dispatch('getApplication', {
      id: this.$route.params.id
    });

    if (app === 'ECONNABORTED') {
      this.$store.commit('showSpinner');
      const interval = setInterval(async () => {
        const data = await this.$store.dispatch('asyncGetApplication');
        if (data !== 'ECONNABORTED' && data !== false) {
          this.$store.commit('hideSpinner');
          this.$store.commit('setViewOutleTitle', this.application.name);
          clearInterval(interval);
        }
      }, 3000);
      return false;
    }

    this.$store.commit('setViewOutleTitle', this.application.name);
    return this.$store.commit('hideSpinner');
    // Determin if the view has already be mounted
  },
  async activated() {
    // console.log('activated');
    if (this.mounted) {
      const app = await this.$store.dispatch('getApplication', {
        id: this.$route.params.id
      });

      if (app === 'ECONNABORTED') {
        this.$store.commit('showSpinner');
        const interval = setInterval(async () => {
          const data = await this.$store.dispatch('asyncGetApplication');
          if (data !== 'ECONNABORTED' && data !== false) {
            this.$store.commit('hideSpinner');
            this.$store.commit('setViewOutleTitle', this.application.name);
            clearInterval(interval);
          }
        }, 3000);
        return false;
      }

      this.$store.commit('setViewOutleTitle', this.application.name);
      this.$store.commit('hideSpinner');
    }
    return this.mounted = true;
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
.img-icon {
  @apply inline-block w-6 h-6 align-top mx-1;
}
.usage-row {
  @apply mt-2 text-sm flex justify-start items-start;
}
.usage-row .col-1 {
  @apply w-10 ml-2;
}
.usage-row .col-2 {
  @apply flex-1 flex items-start;
}
</style>
