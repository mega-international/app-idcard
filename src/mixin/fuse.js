import Fuse from 'fuse.js';

export default {
  data() {
    return {
      applicationOptions: {
        minMatchCharLength: 3,
        findAllMatches: false,
        includeMatches: true,
        threshold: 0.3,
        location: 0,
        distance: 1000,
        useExtendedSearch: true,
        shouldSort: false,
        keys: [
          'id',
          'name',
          'comment',
          'applicationCode',
        ]
      },
      technologyOptions: {
        minMatchCharLength: 3,
        findAllMatches: false,
        includeMatches: true,
        threshold: 0.3,
        location: 0,
        distance: 1000,
        useExtendedSearch: true,
        shouldSort: false,
        keys: [
          'id',
          'name',
          'comment',
          'technologyCode',
        ]
      }
    };
  },
  methods: {
    initApplicationSearch(list) {
      const index = Fuse.createIndex(this.applicationOptions.keys, list);
      return new Fuse(list, this.applicationOptions, index);
    },
    initTechnologySearch(list) {
      const index = Fuse.createIndex(this.technologyOptions.keys, list);
      return new Fuse(list, this.technologyOptions, index);
    }
  }
};
