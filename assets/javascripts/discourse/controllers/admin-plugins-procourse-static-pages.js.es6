import Page from '../models/page';

export default Ember.Controller.extend({

  pageURL: document.location.origin + "/page/",

  basePCPage: function() {
    const a = Em.Object.create({});
    a.set('title', I18n.t('admin.procourse_static_pages.pages.new_title'));
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
      (this.get('originals').group == this.get('selectedItem').group) &&
      (this.get('originals').raw == this.get('selectedItem').raw) &&
      (this.get('originals').html == this.get('selectedItem').html) &&
      (this.get('originals').html_content == this.get('selectedItem').html_content) &&
      (this.get('originals').cooked == this.get('selectedItem').cooked)) ||
      (!this.get('selectedItem').title) ||
      (!this.get('selectedItem').html && !this.get('selectedItem').raw) ||
      (this.get('selectedItem').html && !this.get('selectedItem').html_content)
    ) {
      this.set('disableSave', true);
      return;
    }
    else{
      this.set('disableSave', false);
    };
  }.observes('selectedItem.title', 'selectedItem.slug', 'selectedItem.group', 'selectedItem.raw', 'selectedItem.html', 'selectedItem.html_content'),

  slugify: function(text){
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  },

  actions: {
    selectPCPage: function(page) {
      Page.customGroups().then(g => {
        this.set('customGroups', g);
        if (this.get('selectedItem')) { this.get('selectedItem').set('selected', false); };
        this.set('originals', {
          title: page.title,
          active: page.active,
          slug: page.slug,
          group: page.group,
          raw: page.raw,
          cooked: page.cooked,
          custom_slug: page.custom_slug,
          html: page.html,
          html_content: page.html_content
        });
        this.set('disableSave', true);
        this.set('selectedItem', page);
        page.set('savingStatus', null);
        page.set('selected', true);
      });
    },

    newPCPage: function() {
      var basePCPage = this.get('basePCPage');
      const newPCPage = Em.Object.create(basePCPage);
      var newTitle = I18n.t('admin.procourse_static_pages.pages.new_title');
      newPCPage.set('title', newTitle);
      newPCPage.set('slug', this.slugify(newTitle));
      newPCPage.set('slugEdited', false);
      newPCPage.set('group', null),
      newPCPage.set('newRecord', true);
      newPCPage.set('html', false);
      newPCPage.set('html_content', "");
      this.get('model').pushObject(newPCPage);
      this.send('selectPCPage', newPCPage);
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
      this.send('selectPCPage', this.get('selectedItem'));
    },

    copy: function(page) {
      var newPCPage = Page.copy(page);
      newPCPage.set('title', I18n.t('admin.customize.colors.copy_name_prefix') + ' ' + page.get('title'));
      this.get('model').pushObject(newPCPage);
      this.send('selectPCPage', newPCPage);
      this.set('disableSave', false);
    },

    destroy: function() {
      var self = this,
          item = self.get('selectedItem');

      return bootbox.confirm(I18n.t("admin.procourse_static_pages.pages.delete_confirm"), I18n.t("no_value"), I18n.t("yes_value"), function(result) {
        if (result) {
          if (!item.get('id')) {
            self.removeSelected();
          } else {
            Page.destroy(self.get('selectedItem')).then(function(){ self.removeSelected(); });
          }
        }
      });
    }
  }
});
