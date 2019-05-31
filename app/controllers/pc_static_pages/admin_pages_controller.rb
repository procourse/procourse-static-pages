module PcStaticPages
  class AdminPagesController < Admin::AdminController
    requires_plugin 'procourse-static-pages'

    def create
      pages = PluginStoreRow.where(plugin_name: "procourse_static_pages")
        .where("key LIKE 'p:%'")
        .where("key != 'p:id'")

        id = PluginStore.get("procourse_static_pages", "p:id") || 1

        new_page = {
          id: id,
          active: params[:page][:active],
          title: params[:page][:title],
          slug: params[:page][:slug],
          group: params[:page][:group],
          raw: params[:page][:raw],
          cooked: params[:page][:cooked],
          custom_slug: params[:page][:custom_slug],
          html: params[:page][:html],
          html_content: params[:page][:html_content]
        }
        PluginStore.set("procourse_static_pages", "p:" + id.to_s, new_page)
        PluginStore.set("procourse_static_pages", "p:id", (id.to_i + 1).to_s)

        render json: new_page, root: false
    end

    def update
      page = PluginStore.get("procourse_static_pages", "p:" + params[:page][:id].to_s)
      if page.is_a? String
        page = eval(page)
      end

      if page.nil?
        render_json_error(page)
      else
        page[:active] = params[:page][:active] if !params[:page][:active].nil?
        page[:title] = params[:page][:title] if !params[:page][:title].nil?
        page[:slug] = params[:page][:slug] if !params[:page][:slug].nil?
        page[:group] = params[:page][:group]
        page[:raw] = params[:page][:raw] if !params[:page][:raw].nil?
        page[:cooked] = params[:page][:cooked] if !params[:page][:cooked].nil?
        page[:custom_slug] = params[:page][:custom_slug] if !params[:page][:custom_slug].nil?
        page[:html] = params[:page][:html] if !params[:page][:html].nil?
        page[:html_content] = params[:page][:html_content] if !params[:page][:html_content].nil?

        PluginStore.set("procourse_static_pages", "p:" + params[:page][:id].to_s, page)

        render json: page, root: false
      end
    end

    def destroy
      page = PluginStoreRow.find_by(:key => "p:" + params[:page][:id].to_s)

      if page
        page.destroy
        render json: success_json
      else
        render_json_error(page)
      end
    end

    def show
      pages = PluginStoreRow.where(plugin_name: "procourse_static_pages")
        .where("key LIKE 'p:%'")
        .where("key != 'p:id'")
      render_json_dump(pages)
    end


    private

    def page_params
      params.permit(page: [:active, :title, :slug, :group, :raw, :cooked, :custom_slug, :html, :html_content])[:page]
    end

  end
end
