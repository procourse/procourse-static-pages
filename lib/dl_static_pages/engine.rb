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

require 'open-uri'
require 'net/http'

DiscourseEvent.on(:site_setting_saved) do |site_setting|
  if site_setting.name.to_s == "dl_static_pages_license_key" && site_setting.value_changed?

    if site_setting.value.empty?
      SiteSetting.dl_static_pages_licensed = false
    else
      validate_url = "https://discourseleague.com/licenses/validate?id=14744&key=" + site_setting.value
      request = Net::HTTP.get(URI.parse(validate_url))
      result = JSON.parse(request)
      
      if result["errors"]
        raise Discourse::InvalidParameters.new(
          'Sorry. That key is invalid.'
        )
      end

      if result["enabled"]
        SiteSetting.dl_static_pages_licensed = true
      else
        SiteSetting.dl_static_pages_licensed = false
      end
    end

  end
end