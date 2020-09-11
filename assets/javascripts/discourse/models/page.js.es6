import { ajax } from 'discourse/lib/ajax';
import { default as PrettyText, buildOptions } from 'pretty-text/pretty-text';
import Group from 'discourse/models/group';
import EmberObject from '@ember/object';
import { getURLWithCDN } from "discourse-common/lib/get-url";

const StaticPage = EmberObject.extend(Ember.Copyable, {

  init: function() {
    this._super();
  }
});

function getOpts() {
  const siteSettings = Discourse.__container__.lookup('site-settings:main');

  return buildOptions({
    getURL: getURLWithCDN,
    currentUser: Discourse.__container__.lookup('current-user:main'),
    siteSettings
  });
}


var StaticPages = Ember.ArrayProxy.extend({
  selectedItemChanged: function() {
    var selected = this.get('selectedItem');
    this.get('content').forEach((i) => {
      return i.set('selected', selected === i);
    });
  }.observes('selectedItem')
});

StaticPage.reopenClass({

  findAll: function() {
    var staticPages = StaticPages.create({ content: [], loading: true });
    ajax('/procourse-static-pages/admin/pages.json').then(function(pages) {
      if (pages){
        pages.forEach((staticPage) => {
          var page = JSON.parse(staticPage.value);
            staticPages.pushObject(StaticPage.create({
            id: page.id,
            title: page.title,
            active: page.active,
            slug: page.slug,
            group: page.group,
            raw: page.raw,
            cooked: page.cooked,
            custom_slug: page.custom_slug,
            html: page.html,
            html_content: page.html_content
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
      if (object.html){
        var cooked = "";
      }
      else {
        var cooked = new Handlebars.SafeString(new PrettyText(getOpts()).cook(object.raw));
      }
      data.title = object.title;
      data.slug = object.slug;
      data.group = object.group;
      data.raw = object.raw;
      data.cooked = cooked.string;
      data.custom_slug = object.custom_slug;
      data.html = object.html;
      data.html_content = object.html_content;
    };

    return ajax("/procourse-static-pages/admin/pages.json", {
      data: JSON.stringify({"page": data}),
      type: object.id ? 'PUT' : 'POST',
      dataType: 'json',
      contentType: 'application/json'
    }).catch(function(result){
      if (result.jqXHR.responseJSON && result.jqXHR.responseJSON.errors && result.jqXHR.responseJSON.errors[0]){
        return bootbox.alert(result.jqXHR.responseJSON.errors[0]);
      }
    }).then(function(result) {
      if(result.id) {
        object.set('id', result.id);
        object.set('savingStatus', I18n.t('saved'));
        object.set('saving', false);
      };
    });
  },

  copy: function(object){
    var copiedPage = StaticPage.create(object);
    copiedPage.id = null;
    return copiedPage;
  },

  destroy: function(object) {
    if (object.id) {
      var data = { id: object.id };
      return ajax("/procourse-static-pages/admin/pages.json", {
        data: JSON.stringify({"page": data }),
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json' });
    }
  },

  customGroups: function(){
    return Group.findAll().then(groups => {
      return groups.filter(g => !g.get('automatic'));
    });
  },
});

export default StaticPage;
