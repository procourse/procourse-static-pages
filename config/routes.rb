require_dependency "licenses_constraint"
require_dependency "admin_constraint"

DlStaticPages::Engine.routes.draw do
  resource :admin_pages, path: '/admin/pages', constraints: AdminConstraint.new
end