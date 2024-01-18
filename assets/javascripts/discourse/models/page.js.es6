import { ajax } from 'discourse/lib/ajax';
import { default as PrettyText, buildOptions } from 'pretty-text/pretty-text';
import Group from 'discourse/models/group';
import EmberObject, { observer } from '@ember/object';
import { Array as EmberArray } from '@ember/array';
import { Handlebars } from 'discourse-common/lib/raw-handlebars';
import { getURLWithCDN } from "discourse-common/lib/get-url";

const StaticPage = EmberObject.extend({

  init: function() {
    this._super(...arguments);
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


var StaticPages = EmberObject.extend({
  selectedItemChanged: observer('selectedItem', function() {
    var selected = this.get('selectedItem');
    Array(this.get('content')).forEach(i => {
      i.set('selected', selected === i);
    });
  })
});

StaticPage.reopenClass({

  findAll: function() {
    var staticPages = StaticPages.create({ content: [], loading: true });
    ajax('/procourse-static-pages/admin/pages.json').then(function(pages) {
      if (pages){
        pages.forEach((staticPage) => {
          var page = JSON.parse(staticPage.value);
          staticPages.pushObject(StaticPage.create({
            ...page,
            cooked: page.html ? '' : new Handlebars.SafeString(new PrettyText(getOpts()).cook(page.raw)).string
          }));
        });
      }
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
      data = {
        ...data,
        title: object.title,
        slug: object.slug,
        group: object.group,
        raw: object.raw,
        cooked: cooked.string,
        custom_slug: object.custom_slug,
        html: object.html,
        html_content: object.html_content
      };
    }

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
      }
    });
  },

  copy: function(object){
    var copiedPage = StaticPage.create({
      ...object,
      id: null
    });
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
