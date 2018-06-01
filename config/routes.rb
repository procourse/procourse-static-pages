require_dependency "admin_constraint"

PcStaticPages::Engine.routes.draw do
  resource :admin_pages, path: '/admin/pages', constraints: AdminConstraint.new
end
