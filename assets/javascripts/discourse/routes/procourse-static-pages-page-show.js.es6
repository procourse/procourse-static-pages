import Page from '../models/page-show';
import DiscourseURL from 'discourse/lib/url';
import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  model(opts) {
    return Page.findById(opts);
  },

  titleToken() {
    const model = this.modelFor('procourse-static-pages.page.show');
    if (model && model.title) {
      return model.title;
    }
  },

  setupController(controller, model) {
    controller.setProperties({ model });
  },

  afterModel: function(result) {
    var newURL = `/page/${result.slug}/${result.id}/`;
    DiscourseURL.routeTo(newURL, { replaceURL: true });
  }
});
