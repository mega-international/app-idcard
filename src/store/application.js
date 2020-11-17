/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

import {
  searchApplication,
  getApplication,
  asyncSearchApplication,
  asyncGetApplication
} from '@/api/application.js';

import { getDB } from '@/assets/js/idb.js';
import { getViewedItems, checkAsyncTask } from '../api/api.js';

export default {
  state: {
    applications: [],
    application: {},
    favorites: [],
    lastViewedApp: []
  },
  getters: {
  },
  mutations: {
    searchApplication(state, applications) {
      state.applications = applications;
    },
    getApplication(state, application) {
      state.application = application;
    },
    getLastViewedApplication(state, lastViewedApp) {
      state.lastViewedApp = lastViewedApp;
    },
    getFavoriteApplications(state, applications) {
      state.favorites = applications;
    }
  },
  actions: {
    async searchApplication({ commit }, params) {
      const data = await searchApplication(params.criteria);
      if (data !== false) {
        commit('searchApplication', data);
      }
      return data;
    },
    async getApplication({ commit }, params) {
      const data = await getApplication(params.id);
      if (data !== false) {
        commit('getApplication', data);
      }
      return data;
    },
    async getLastViewedApplication({ commit }) {
      const data = await getViewedItems('application');
      commit('getLastViewedApplication', data);
      return data;
    },
    async getFavoriteApplications({ commit }) {
      const db = await getDB();
      const data = await db.getAllFromIndex('application', 'favorite', 'true');
      commit('getFavoriteApplications', data);
    },
    async asyncSearchApplication({ commit }) {
      try {
        const asyncJob = JSON.parse(localStorage.getItem('lastQuery'));
        if (!checkAsyncTask(asyncJob)) return false;
        const data = await asyncSearchApplication(asyncJob);
        if (data !== false) {
          commit('searchApplication', data);
        }
        return data;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async asyncGetApplication({ commit }, id) {
      try {
        const asyncJob = JSON.parse(localStorage.getItem('lastQuery'));
        if (!checkAsyncTask(asyncJob)) return false;
        const data = await asyncGetApplication({ ...asyncJob, id });
        if (data !== false) {
          commit('getApplication', data);
        }
        return data;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }
};
