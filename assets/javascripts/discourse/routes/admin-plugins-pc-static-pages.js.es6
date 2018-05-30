import Page from '../models/page';

export default Discourse.Route.extend({
  model() {
    return Page.findAll();
  },

  setupController(controller, model) {
    controller.setProperties({ model });
  }
});