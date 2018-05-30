# name: procourse-static-pages
# about: Adds the ability to create static pages for Discourse.
# version: 0.1
# author: Joe Buhlig joebuhlig.com
# url: https://www.github.com/procourse/procourse-static-pages

enabled_site_setting :procourse_static_pages_enabled

add_admin_route 'procourse_static_pages.title', 'procourse-static-pages'

register_asset "stylesheets/pc-static-pages.scss"

Discourse::Application.routes.append do
  get '/admin/plugins/procourse-static-pages' => 'admin/plugins#index', constraints: StaffConstraint.new
  get '/page/:slug/:id' => 'procourse_static_pages/pages#show'
  get '/page/:id' => 'procourse_static_pages/pages#show'
end

load File.expand_path('../lib/procourse_static_pages/engine.rb', __FILE__)
