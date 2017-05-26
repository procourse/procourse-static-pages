import { ajax } from 'discourse/lib/ajax';
import { default as PrettyText, buildOptions } from 'pretty-text/pretty-text';

const StaticPage = Discourse.Model.extend(Ember.Copyable, {

  init: function() {
    this._super();
  }
});

function getOpts() {
  const siteSettings = Discourse.__container__.lookup('site-settings:main');

  return buildOptions({
    getURL: Discourse.getURLWithCDN,
    currentUser: Discourse.__container__.lookup('current-user:main'),
    siteSettings
  });
}


var StaticPages = Ember.ArrayProxy.extend({
  selectedItemChanged: function() {
    var selected = this.get('selectedItem');
    _.each(this.get('content'),function(i) {
      return i.set('selected', selected === i);
    });
  }.observes('selectedItem')
});

StaticPage.reopenClass({

  findAll: function() {
    var staticPages = StaticPages.create({ content: [], loading: true });
    ajax('/p/admin/pages.json').then(function(pages) {
      if (pages){
        _.each(pages, function(staticPage){
            staticPages.pushObject(StaticPage.create({
            id: staticPage.id,
            title: staticPage.title,
            active: staticPage.active,
            slug: staticPage.slug,
            raw: staticPage.raw,
            cooked: staticPage.cooked,
            custom_slug: staticPage.custom_slug
          }));
        });
      };
      staticPages.set('loading', false);
    });
    return staticPages;
  },

  save: function(object, enabledOnly=false) {
    if (object.get('disableSave')) return;
    
    object.set('savingStatus', I18n.t('saving'));
    object.set('saving',true);

    var data = { active: object.active };

    if (object.id){
      data.id = object.id;
    }

    if (!object || !enabledOnly) {
      var cooked = new Handlebars.SafeString(new PrettyText(getOpts()).cook(object.raw));
      data.title = object.title;
      data.slug = object.slug;
      data.raw = object.raw;
      data.cooked = cooked.string;
      data.custom_slug = object.custom_slug;
    };
    
    return ajax("/p/admin/pages.json", {
      data: JSON.stringify({"league_page": data}),
      type: object.id ? 'PUT' : 'POST',
      dataType: 'json',
      contentType: 'application/json'
    }).then(function(result) {
      if(result.id) { object.set('id', result.id); }
      object.set('savingStatus', I18n.t('saved'));
      object.set('saving', false);
    });
  },

  copy: function(object){
    var copiedPage = LeaguePage.create(object);
    copiedPage.id = null;
    return copiedPage;
  },

  destroy: function(object) {
    if (object.id) {
      var data = { id: object.id };
      return ajax("/p/admin/pages.json", { 
        data: JSON.stringify({"page": data }), 
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json' });
    }
  }
});

export default StaticPage;