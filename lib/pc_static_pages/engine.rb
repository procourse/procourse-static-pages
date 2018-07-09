require 'open-uri'
require 'net/http'

module PcStaticPages
  class Engine < ::Rails::Engine
    isolate_namespace PcStaticPages

    config.after_initialize do
  		Discourse::Application.routes.append do
  			mount ::PcStaticPages::Engine, at: "/procourse-static-pages"
  		end

    end
  end
end
