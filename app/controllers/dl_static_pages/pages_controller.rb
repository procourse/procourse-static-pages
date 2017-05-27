module DlStaticPages
  class PagesController < ApplicationController

    def show
      if params[:id]
        pages = PluginStore.get("dl_static_pages", "pages") || []
        page = pages.select{|page| page[:id] == params[:id].to_i}
      end

      if !page.empty? && page[0][:active]
        render_json_dump(page[0])
      else
        render nothing: true, status: 404
      end

    end

  end
end