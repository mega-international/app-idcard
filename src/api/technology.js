import {
  createRequest, handleError, ensureSuccess, handleOfflineFallback, idbItemPassThrough
} from './api.js';
import store from '../store/index.js';
import { query, getDB, isLocalChange } from '../assets/js/idb.js';

export async function searchTechnology(criteria) {
  if (store.getters.isOnline && navigator.onLine) {
    return query({
      async: true,
      query: `query {
          softwareTechnology (orderBy: [ name_ASC ], filter: {or: [{name_contains: "${criteria}"},{technologyCode_contains: "${criteria}"},{comment_contains: "${criteria}"}]}) {
          id
          name
          comment(format:RAW)
          technologyCode
        }
      }`
    })
      .then(async (response) => {
        if (response.status === 206) {
          return {
            async: true,
            task: response.headers['x-hopex-task'] ? response.headers['x-hopex-task'] : false,
            sessiontoken: response.headers['x-hopex-sessiontoken'] ? response.headers['x-hopex-sessiontoken'] : false,
          };
        }
        return response;
      })
      .then(ensureSuccess)
      .then(async (result) => {
        if (result.async) {
          localStorage.setItem('lastQuery', JSON.stringify({
            sessiontoken: result.sessiontoken,
            task: result.task
          }));
          return 'ECONNABORTED';
        }
        const { data } = result;
        // Technology
        const technologies = data.data.softwareTechnology;
        for (const technology of technologies) {
          idbItemPassThrough(technology, 'technology');
        }
        return technologies;
      })
      .catch(async (error) => {
        const err = await handleOfflineFallback(error);
        if (err === 'ECONNABORTED') {
          return 'ECONNABORTED';
        }
        if (err) {
          const idb = await getDB();
          return idb.getAllFromIndex('technology', 'id');
        }
        return Promise.reject(error);
      })
      .catch(handleError);
  }
  const idb = await getDB();
  return idb.getAllFromIndex('technology', 'id');
}

export async function getTechnology(id) {
  if (store.getters.isOnline && navigator.onLine) {
    return query({
      query: `query {
        softwareTechnology (filter: {id:"${id}"}) {
          id
          name
          comment
          technologyCode
          companyStandard
          beginLifeDate
          endLifeDate
          initiative {
            portfolio {
              name
              portfolioManager_PersonSystem {
                name
              }
            }
          }
          financialController_PersonSystem {
            name
          }
          technologyCorrespondent_PersonSystem {
            name
          }
          technicalFunctionality {
            name
          }
          type {
            name
          }
          application {
            id
            name
            applicationOwner_PersonSystem {
              name
            }
          }
        }
      }`
    })
      .then(ensureSuccess)
      .then(async ({ data }) => {
      // technology
        const technology = data.data.softwareTechnology[0];
        technology.dateViewed = new Date();
        idbItemPassThrough(technology, 'technology');
        return technology;
      })
      .catch(async (error) => {
        if (await handleOfflineFallback(error)) {
          const idb = await getDB();
          const data = await idb.getFromIndex('technology', 'id', id);
          return data;
        }
        return Promise.reject(error);
      })
      .catch(handleError);
  }
  const idb = await getDB();
  return idb.getAllFromIndex('technology', 'id');
}

export async function asyncGetTechnology({ id, task, sessiontoken }) {
  if (store.getters.isOnline && navigator.onLine) {
    return query({
      async: true,
      headers: {
        'x-hopex-task': task,
        'x-hopex-sessiontoken': sessiontoken
      },
    })
      .then(async (response) => {
        if (response.status === 206) {
          return {
            async: true,
            task: response.headers['x-hopex-task'] ? response.headers['x-hopex-task'] : false,
            sessiontoken: response.headers['x-hopex-sessiontoken'] ? response.headers['x-hopex-sessiontoken'] : false,
          };
        }
        return response;
      })
      .then(ensureSuccess)
      .then(async (result) => {
        if (result.async) {
          localStorage.setItem('lastQuery', JSON.stringify({
            sessiontoken: result.sessiontoken,
            task: result.task
          }));
          return 'ECONNABORTED';
        }
        const { data } = result;
        // Technology
        const technology = data.data.softwareTechnology[0];
        technology.dateViewed = new Date();
        idbItemPassThrough(technology, 'technology');
        return technology;
      })
      .catch(async (error) => {
        if (await handleOfflineFallback(error)) {
          const idb = await getDB();
          const data = await idb.getFromIndex('technology', 'id', id);
          return data;
        }
        return Promise.reject(error);
      })
      .catch(handleError);
  }
  const idb = await getDB();
  return idb.getAllFromIndex('technology', 'id');
}

export async function asyncSearchTechnology({ task, sessiontoken }) {
  if (store.getters.isOnline && navigator.onLine) {
    return query({
      async: true,
      headers: {
        'x-hopex-task': task,
        'x-hopex-sessiontoken': sessiontoken
      },
    })
      .then(async (response) => {
        if (response.status === 206) {
          return {
            async: true,
            task: response.headers['x-hopex-task'] ? response.headers['x-hopex-task'] : false,
            sessiontoken: response.headers['x-hopex-sessiontoken'] ? response.headers['x-hopex-sessiontoken'] : false,
          };
        }
        return response;
      })
      .then(ensureSuccess)
      .then(async (result) => {
        if (result.async) {
          localStorage.setItem('lastQuery', JSON.stringify({
            sessiontoken: result.sessiontoken,
            task: result.task
          }));
          return 'ECONNABORTED';
        }
        const { data } = result;
        // Technology
        const technologies = data.data.softwareTechnology;
        for (const technology of technologies) {
          technology.dateViewed = new Date();
          idbItemPassThrough(technology, 'technology');
        }
        const idb = await getDB();
        return technologies;
      })
      .catch(async (error) => {
        const err = await handleOfflineFallback(error);
        if (err === 'ECONNABORTED') {
          return 'ECONNABORTED';
        }
        if (err) {
          const idb = await getDB();
          return idb.getAllFromIndex('technology', 'id');
        }
        return Promise.reject(error);
      })
      .catch(handleError);
  }
  const idb = await getDB();
  return idb.getAllFromIndex('technology', 'id');
}
