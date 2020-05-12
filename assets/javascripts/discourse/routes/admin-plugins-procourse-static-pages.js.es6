import Page from '../models/page';
import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  model() {
    return Page.findAll();
  },

  setupController(controller, model) {
    controller.setProperties({ model });
  }
});
