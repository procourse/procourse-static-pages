export default function(){
  this.route('procourse-static-pages', {path: '/page'}, function(){
    this.route('page', {path: '/' }, function(){
      this.route('show', {path: '/:slug/:id'});
    });
  });
};
