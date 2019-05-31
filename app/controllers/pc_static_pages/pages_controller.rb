module PcStaticPages
  class PagesController < ApplicationController

    def show
      if params[:id]
        page = PluginStore.get("procourse_static_pages", "p:" + params[:id])

        if page.is_a? String
          page = eval(page)
        end
      end

      render404 = false

      if page && page[:group]
        unless current_user
         render404 = true
        end

        group = Group.find(page[:group])
        unless group && group.users && group.users.include?(current_user)
          render404 = true
        end
      end

      if page && page[:active] && !render404
        render_json_dump(page)
      else
        render body:nil, status: 404
      end

    end

  end
end
