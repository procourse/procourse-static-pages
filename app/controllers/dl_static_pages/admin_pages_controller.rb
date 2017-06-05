module DlStaticPages
  class AdminPagesController < Admin::AdminController
    requires_plugin 'dl-static-pages'

    def create
      id = PluginStore.get("dl_static_pages", "p:id") || 1

      new_page = { 
        id: id, 
        active: params[:page][:active], 
        title: params[:page][:title], 
        slug: params[:page][:slug], 
        raw: params[:page][:raw], 
        cooked: params[:page][:cooked], 
        custom_slug: params[:page][:custom_slug]
      }
      PluginStore.set("dl_static_pages", "p:" + id.to_s, new_page)
      PluginStore.set("dl_static_pages", "p:id", id + 1)

      render json: new_page, root: false
    end

    def update
      page = PluginStore.get("dl_static_pages", "p:" + params[:page][:id].to_s)

      if page.nil?
        render_json_error(page)
      else
        page[:active] = params[:page][:active] if !params[:page][:active].nil?
        page[:title] = params[:page][:title] if !params[:page][:title].nil?
        page[:slug] = params[:page][:slug] if !params[:page][:slug].nil?
        page[:raw] = params[:page][:raw] if !params[:page][:raw].nil?
        page[:cooked] = params[:page][:cooked] if !params[:page][:cooked].nil?
        page[:custom_slug] = params[:page][:custom_slug] if !params[:page][:custom_slug].nil?

        PluginStore.set("dl_static_pages", "p:" + params[:page][:id].to_s, page)

        render json: page, root: false
      end
    end

    def destroy
      pages = PluginStore.get("dl_static_pages", "pages")

      page = pages.select{|page| page[:id] == params[:page][:id]}

      pages.delete(page[0])

      PluginStore.set("dl_static_pages", "pages", pages)

      render json: success_json
    end

    def show
      pages = PluginStoreRow.where(plugin_name: "dl_static_pages")
        .where("key LIKE 'p:%'")
        .where("key != 'p:id'")
      render_json_dump(pages)
    end


    private

    def page_params
      params.permit(page: [:active, :title, :slug, :raw, :cooked, :custom_slug])[:page]
    end

  end
end