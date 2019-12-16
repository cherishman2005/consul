import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    s: {
      as: 'filter',
      replace: true,
    },
    // temporary support of old style status
    status: {
      as: 'status',
    },
  },
  model: function(params) {
    let terms = params.s || '';
    // we check for the old style `status` variable here
    // and convert it to the new style filter=status:critical
    let status = params.status;
    if (status) {
      status = `status:${status}`;
      if (terms.indexOf(status) === -1) {
        terms = terms
          .split('\n')
          .concat(status)
          .join('\n')
          .trim();
      }
    }
    return {
      terms: terms !== '' ? terms.split('\n') : [],
      items: this.repo.findAllByDatacenter(
        this.modelFor('dc').dc.Name,
        this.modelFor('nspace').nspace.substr(1)
      ),
    });
  },
  setupController: function(controller, model) {
    controller.setProperties(model);
  },
});
