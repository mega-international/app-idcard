/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

import {
  searchTechnology,
  getTechnology,
  asyncSearchTechnology,
  asyncGetTechnology
} from '@/api/technology.js';

import { getDB } from '@/assets/js/idb.js';
import { getViewedItems, checkAsyncTask } from '../api/api.js';

export default {
  state: {
    technologies: [],
    technology: {},
    favorites: [],
    lastViewedTech: []
  },
  getters: {
  },
  mutations: {
    searchTechnology(state, technologies) {
      state.technologies = technologies;
    },
    getTechnology(state, technology) {
      state.technology = technology;
    },
    getLastViewedTechnology(state, lastViewedTech) {
      state.lastViewedTech = lastViewedTech;
    },
    getFavoriteTechnologies(state, technologies) {
      state.favorites = technologies;
    }
  },
  actions: {
    async searchTechnology({ commit, dispatch }, params) {
      const data = await searchTechnology(params.criteria);
      if (data !== false) {
        commit('searchTechnology', data);
      }
      return data;
    },
    async getTechnology({ commit, dispatch }, params) {
      const data = await getTechnology(params.id);
      if (data !== false) {
        commit('getTechnology', data);
      }
      return data;
    },
    async getLastViewedTechnology({ commit }) {
      const data = await getViewedItems('technology');
      commit('getLastViewedTechnology', data);
      return data;
    },
    async getFavoriteTechnologies({ commit }) {
      const db = await getDB();
      const data = await db.getAllFromIndex('technology', 'favorite', 'true');
      commit('getFavoriteTechnologies', data);
    },
    async asyncSearchTechnology({ commit }) {
      try {
        const asyncJob = JSON.parse(localStorage.getItem('lastQuery'));
        if (!checkAsyncTask(asyncJob)) return false;
        const data = await asyncSearchTechnology(asyncJob);
        if (data !== false) {
          commit('searchTechnology', data);
        }
        return data;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async asyncGetTechnology({ commit }, id) {
      try {
        const asyncJob = JSON.parse(localStorage.getItem('lastQuery'));
        if (!checkAsyncTask(asyncJob)) return false;
        const data = await asyncGetTechnology({ ...asyncJob, id });
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
