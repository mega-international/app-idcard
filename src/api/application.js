import {
  createRequest, handleError, ensureSuccess, handleOfflineFallback, idbItemPassThrough
} from './api.js';
import store from '../store/index.js';
import { query, getDB, isLocalChange } from '../assets/js/idb.js';

export async function searchApplication(criteria) {
  if (store.getters.isOnline && navigator.onLine) {
    return query({
      query: `query {
        application (orderBy: [ name_ASC ], filter: {or: [{name_contains: "${criteria}"},{applicationCode_contains: "${criteria}"},{comment_contains: "${criteria}"}]}) {
          id
          name
          comment(format:RAW)
          applicationCode
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
        // Application
        const applications = data.data.application;
        for (const application of applications) {
          idbItemPassThrough(application, 'application');
        }
        return applications;
      })
      .catch(async (error) => {
        const err = await handleOfflineFallback(error);
        if (err === 'ECONNABORTED') {
          return 'ECONNABORTED';
        }
        if (err) {
          const idb = await getDB();
          return idb.getAllFromIndex('application', 'id');
        }
        return Promise.reject(error);
      })
      .catch(handleError);
  }
  const idb = await getDB();
  return idb.getAllFromIndex('application', 'id');
}

export async function getApplication(id) {
  if (store.getters.isOnline && navigator.onLine) {
    return query({
      async: true,
      query: `query {
        application (filter: {id:"${id}"}) {
          id
          name
          businessValueAPM
          functionalSupportAPM
          technicalEfficiencyAPM
          technologyCompliance
          lastAssessmentDate
          comment
          applicationCode
          applicationOwner_PersonSystem { name email }
          applicationType
          versionNumber
          cloudComputing
          currentNumberOfUsers
          beginLifeDate
          endLifeDate
          initiative {
            portfolio {
              name
              portfolioManager_PersonSystem { name email }
            }
          }
          businessCapability {name comment}
          functionality {name comment}
          businessProcess {name comment}
          softwareTechnology_UsedTechnology {
            id
            name
          }
          businessOwner_PersonSystem { name email }
          iTOwner_PersonSystem { name email }
          softwareDesigner_PersonSystem { name email }
          financialController_PersonSystem { name email }
          softwareInstallation {
            name
            serverDeployed_DeploymentSupport {
              name
            }
            site_DeploymentSupport {
              name
            }
            usageContext_ApplicationDeploymentContext {
              name
              orgUnit_DeploymentUser {
                name
              }
              numberOfUsers
            }
          }
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
        // Application
        const app = data.data.application[0];
        app.dateViewed = new Date();
        idbItemPassThrough(app, 'application');
        return app;
      })
      .catch(async (error) => {
        if (await handleOfflineFallback(error)) {
          const idb = await getDB();
          const data = await idb.getFromIndex('application', 'id', id);
          return data;
        }
        return Promise.reject(error);
      })
      .catch(handleError);
  }
  const idb = await getDB();
  return idb.getAllFromIndex('application', 'id');
}

export async function asyncGetApplication({ id, task, sessiontoken }) {
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
        // Application
        const app = data.data.application[0];
        app.dateViewed = new Date();
        idbItemPassThrough(app, 'application');
        return app;
      })
      .catch(async (error) => {
        if (await handleOfflineFallback(error)) {
          const idb = await getDB();
          const data = await idb.getFromIndex('application', 'id', id);
          return data;
        }
        return Promise.reject(error);
      })
      .catch(handleError);
  }
  const idb = await getDB();
  return idb.getAllFromIndex('application', 'id');
}

export async function asyncSearchApplication({ task, sessiontoken }) {
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
        // Application
        const applications = data.data.application;
        for (const app of applications) {
          app.dateViewed = new Date();
          idbItemPassThrough(app, 'application');
        }
        return applications;
      })
      .catch(async (error) => {
        const err = await handleOfflineFallback(error);
        if (err === 'ECONNABORTED') {
          return 'ECONNABORTED';
        }
        if (err) {
          const idb = await getDB();
          return idb.getAllFromIndex('application', 'id');
        }
        return Promise.reject(error);
      })
      .catch(handleError);
  }
  const idb = await getDB();
  return idb.getAllFromIndex('application', 'id');
}
