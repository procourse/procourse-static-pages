module DlStaticPages
  class AdminPagesController < Admin::AdminController
    requires_plugin 'dl-static-pages'

    def create
      pages = PluginStore.get("dl_static_pages", "pages")

      if pages.nil?
        pages = []
        id = 1
      else
        until pages.select{|page| page[:id] == id}.empty?
          id = SecureRandom.random_number(10000)
        end
      end

      new_page = { 
        id: id, 
        active: params[:page][:active], 
        title: params[:page][:title], 
        slug: params[:page][:slug], 
        raw: params[:page][:raw], 
        cooked: params[:page][:cooked], 
        custom_slug: params[:page][:custom_slug]
      }

      pages.push(new_page)
      PluginStore.set("dl_static_pages", "pages", pages)

      render json: new_page, root: false
    end

    def update
      pages = PluginStore.get("dl_static_pages", "pages")
      page = pages.select{|page| page[:id] == id}

      if page.empty?
        render_json_error(page)
      else
        page[0][:active] = params[:page][:active] if !params[:page][:active].nil?
        page[0][:title] = params[:page][:title] if !params[:page][:title].nil?
        page[0][:slug] = params[:page][:slug] if !params[:page][:slug].nil?
        page[0][:raw] = params[:page][:raw] if !params[:page][:raw].nil?
        page[0][:cooked] = params[:page][:cooked] if !params[:page][:cooked].nil?
        page[0][:custom_slug] = params[:page][:custom_slug] if !params[:page][:custom_slug].nil?

        PluginStore.set("dl_static_pages", "pages", pages)

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
      pages = PluginStore.get("dl_static_pages", "pages")
      render_json_dump(pages)
    end


    private

    def page_params
      params.permit(page: [:active, :title, :slug, :raw, :cooked, :custom_slug])[:page]
    end

  end
end