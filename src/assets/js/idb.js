import { openDB } from 'idb/with-async-ittr.js';
import store from '@/store/index.js';
import { createRequest, idbItemPassThrough } from '../../api/api.js';

export async function createDB(name, version, callback) {
  try {
    const dbPromise = await openDB(name, version, {
      upgrade(dbPromise, oldVersion, newVersion, transaction) {
        callback(dbPromise, oldVersion, newVersion, transaction);
      },
    });
    return dbPromise;
  } catch (error) {
    console.warn('IDB version regression!');
    console.error(error);
    return false;
  }
}

/**
 * CreateObjectStore
 * @param {IDB proxy} dbPromise The reference to idb
 * @param {IDB transaction} transaction Idb transaction
 * @param {String} name Name of the objecet store
 * @param {Object} params Db prams
 */
async function createObjectStore(dbPromise, transaction, name, params) {
  if (!await dbPromise.objectStoreNames.contains(name)) {
    return dbPromise.createObjectStore(name, params);
  }
  return transaction.objectStore(name);
}

/**
 * CreateIndex
 * @param {Idb ObjectStore} store ObjectStore reference
 * @param {String} name ObjectStore name
 * @param {String} path Path to access primary key
 * @param {Object} params Optional params
 */
function createIndex(store, name, path, params) {
  if (!store.indexNames.contains(name)) {
    store.createIndex(name, path, params);
  }
}

/**
 *
 */
export async function getDB() {
  return createDB('Application ID Card', 4, async (dbPromise, oldVersion, newVersion, transaction) => {
    const applicationStore = await createObjectStore(dbPromise, transaction, 'application', {
      keyPath: 'id',
    });
    createIndex(applicationStore, 'id', 'id');
    createIndex(applicationStore, 'name', 'name');
    createIndex(applicationStore, 'comment', 'comment');
    createIndex(applicationStore, 'applicationCode', 'applicationCode');
    createIndex(applicationStore, 'dateViewed', 'dateViewed');
    createIndex(applicationStore, 'favorite', 'favorite');

    const technologyStore = await createObjectStore(dbPromise, transaction, 'technology', {
      keyPath: 'id',
    });
    createIndex(technologyStore, 'id', 'id');
    createIndex(technologyStore, 'name', 'name');
    createIndex(technologyStore, 'comment', 'comment');
    createIndex(technologyStore, 'technologyCode', 'technologyCode');
    createIndex(technologyStore, 'dateViewed', 'dateViewed');
    createIndex(technologyStore, 'favorite', 'favorite');
  });
}

export async function isLocalChange(id, externalId, table) {
  let data = await idbItemPassThrough({ id }, table, false);
  // If no data for this ID, search for external ID
  if (!data && externalId) data = await idbItemPassThrough({ externalId }, table, false, 'externalId');
  return (data && data.synced === 'false') || (data && data.toDelete === 'true') || (data && data.uploaded === 'false');
}

/**
 *
 * @param {*} param0
 */
export function query({
  query = null, async = false, headers = {}, auth = false, timeout = true
}) {
  const request = createRequest(auth, timeout);
  const waitTimeout = window.config && window.config.ASYNC_timeout ? window.config.ASYNC_timeout : false;
  return request.post(`/hopexgraphQL/api${async ? '/async' : ''}/ITPM`, query !== null ? {
    query: query
      .replace(/#.*\n/g, '')
      .replace(/[\s|,]*\n+[\s|,]*/g, ' ')
      .replace(/:\s/g, ':')
      .replace(/,\s/g, ',')
      .replace(/\)\s\{/g, '){')
      .replace(/\}\s/g, '}')
      .replace(/\{\s/g, '{')
      .replace(/\s\}/g, '}')
      .replace(/\s\{/g, '{')
      .replace(/\)\s/g, ')')
      .replace(/\(\s/g, '(')
      .replace(/\s\)/g, ')')
      .replace(/\s\(/g, '(')
      .replace(/=\s/g, '=')
      .replace(/\s=/g, '=')
      .replace(/@\s/g, '@')
      .replace(/\s@/g, '@')
      .replace(/\s\$/g, '$')
      .replace(/\s\./g, '.')
  } : null, {
    headers: {
      Authorization: `Bearer ${store.getters.getToken}`,
      ...(async && waitTimeout ? { 'x-hopex-wait': waitTimeout } : {}),
      ...headers
    }
  });
}
