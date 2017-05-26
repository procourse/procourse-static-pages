export default function(){
  this.route('dl-static-pages', {path: '/p'}, function(){
    this.route('page', {path: '/:slug/:id' }, function(){
      this.route('show', {path: '/'});
    });
  });
};