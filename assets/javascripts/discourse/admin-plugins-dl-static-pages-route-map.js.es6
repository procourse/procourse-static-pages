export default {
  resource: 'admin.adminPlugins',
  path: '/plugins',
  map() {
    this.route('dl-static-pages', function(){
      this.route('index', {path: '/'});
    });
  }
};