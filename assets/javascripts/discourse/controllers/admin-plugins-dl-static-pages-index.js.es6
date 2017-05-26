import Page from '../models/page';
import { licensed } from 'discourse/plugins/dl-static-pages/discourse/lib/constraint';

export default Ember.Controller.extend({
  
  pageURL: document.location.origin + "/p/",

  licensed: licensed(),

  baseDLPage: function() {
    var a = [];
    a.set('title', I18n.t('admin.dl_static_pages.pages.new_title'));
    a.set('active', false);
    return a;
  }.property('model.@each.id'),

  removeSelected: function() {
    this.get('model').removeObject(this.get('selectedItem'));
    this.set('selectedItem', null);
  },

  editTitle: function(){
    this.set('editingTitle', true);
    if (this.get('selectedItem') && !this.get('selectedItem').custom_slug && this.get('selectedItem').selected){
      this.get('selectedItem').set('slug', this.slugify(this.get('selectedItem').title));
    };
    this.set('editingTitle', false);
  }.observes('selectedItem.title'),

  editSlug: function(){
    if (this.get('selectedItem') && !this.get('editingTitle') && this.get('selectedItem').selected){
      if (this.get('originals').slug == this.get('selectedItem').slug){
        this.get('selectedItem').set('custom_slug', this.get('originals').custom_slug);
      }
      else{
        this.get('selectedItem').set('custom_slug', true);
      }
    }
  }.observes('selectedItem.slug'),

  changed: function(){
    if (!this.get('originals') || !this.get('selectedItem')) {this.set('disableSave', true); return;}
    if (((this.get('originals').title == this.get('selectedItem').title) &&
      (this.get('originals').slug == this.get('selectedItem').slug) &&
      (this.get('originals').raw == this.get('selectedItem').raw) &&
      (this.get('originals').cooked == this.get('selectedItem').cooked)) ||
      (!this.get('selectedItem').title) ||
      (!this.get('selectedItem').raw)
    ) {
      this.set('disableSave', true); 
      return;
    }
    else{
      this.set('disableSave', false);
    };
  }.observes('selectedItem.title', 'selectedItem.slug', 'selectedItem.raw'),

  slugify: function(text){
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  },

  actions: {
    selectDLPage: function(page) {
      if (this.get('selectedItem')) { this.get('selectedItem').set('selected', false); };
      this.set('originals', {
        title: page.title,
        active: page.active,
        slug: page.slug,
        raw: page.raw,
        cooked: page.cooked,
        custom_slug: page.custom_slug
      });
      this.set('disableSave', true);
      this.set('selectedItem', page);
      page.set('savingStatus', null);
      page.set('selected', true);
    },

    newDLPage: function() {
      const newDLPage = Em.copy(this.get('baseDLPage'), true);
      var newTitle = I18n.t('admin.dl_static_pages.pages.new_title');
      newDLPage.set('title', newTitle);
      newDLPage.set('slug', this.slugify(newTitle));
      newDLPage.set('slugEdited', false);
      newDLPage.set('newRecord', true);
      this.get('model').pushObject(newDLPage);
      this.send('selectDLPage', newDLPage);
    },

    toggleEnabled: function() {
      var selectedItem = this.get('selectedItem');
      selectedItem.toggleProperty('active');
      Page.save(this.get('selectedItem'), true);
    },

    disableEnable: function() {
      return !this.get('id') || this.get('saving');
    }.property('id', 'saving'),

    newRecord: function() {
      return (!this.get('id'));
    }.property('id'),

    save: function() {
      if (this.get('selectedItem').slug == this.slugify(this.get('selectedItem').title)){
        this.get('selectedItem').set('custom_slug', false);
      }
      Page.save(this.get('selectedItem'));
      this.send('selectDLPage', this.get('selectedItem'));
    },

    copy: function(page) {
      var newDLPage = Page.copy(page);
      newDLPage.set('title', I18n.t('admin.customize.colors.copy_name_prefix') + ' ' + page.get('title'));
      this.get('model').pushObject(newDLPage);
      this.send('selectDLPage', newDLPage);
      this.set('disableSave', false);
    },

    destroy: function() {
      var self = this,
          item = self.get('selectedItem');

      return bootbox.confirm(I18n.t("admin.dl_static_pages.pages.delete_confirm"), I18n.t("no_value"), I18n.t("yes_value"), function(result) {
        if (result) {
          if (item.get('newRecord')) {
            self.removeSelected();
          } else {
            Page.destroy(self.get('selectedItem')).then(function(){ self.removeSelected(); });
          }
        }
      });
    }
  }
});