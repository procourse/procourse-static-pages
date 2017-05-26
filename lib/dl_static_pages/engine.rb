module DlStaticPages
  class Engine < ::Rails::Engine
    isolate_namespace DlStaticPages

    config.after_initialize do
  		Discourse::Application.routes.append do
  			mount ::DlStaticPages::Engine, at: "/dl-static-pages"
  		end
    end
  end
end