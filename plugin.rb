# name: dl-static-pages
# about: Adds the ability to create static pages for Discourse.
# version: 0.1
# author: Joe Buhlig joebuhlig.com
# url: https://www.github.com/discourseleague/dl-static-pages

enabled_site_setting :dl_static_pages_enabled

add_admin_route 'dl_static_pages.title', 'dl-static-pages'

register_asset "stylesheets/dl-static-pages.scss"

Discourse::Application.routes.append do
  get '/admin/plugins/dl-static-pages' => 'admin/plugins#index', constraints: StaffConstraint.new
end

load File.expand_path('../lib/dl_static_pages/engine.rb', __FILE__)