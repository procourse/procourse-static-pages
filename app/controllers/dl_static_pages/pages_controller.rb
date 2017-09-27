module DlStaticPages
  class PagesController < ApplicationController

    def show
      if params[:id]
        page = PluginStore.get("dl_static_pages", "p:" + params[:id])
      end

      if page && page[:active]
        render_json_dump(page)
      else
        render body: nil, status: 404
      end

    end

  end
end