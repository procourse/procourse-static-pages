module PcStaticPages
  class PagesController < ApplicationController

    def show
      if params[:id]
        page = PluginStore.get("procourse_static_pages", "p:" + params[:id])

        if page.is_a? String
          page = eval(page)
        end
      end

      if page && page[:active]
        render_json_dump(page)
      else
        render body: nil, status: 404
      end

    end

  end
end
