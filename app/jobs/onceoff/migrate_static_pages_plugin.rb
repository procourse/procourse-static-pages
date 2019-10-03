module Jobs
  class MigrateStaticPagesPlugin < ::Jobs::Onceoff
    # Migrate content from dl_static_pages name to procourse_static_pages
    def execute_onceoff(args)
        dl_page_presence = PluginStoreRow.where(plugin_name: "dl_static_pages").exists?
        if dl_page_presence
            # Migrate the page content rows
            PluginStoreRow.where(plugin_name: 'dl_static_pages')
            .find_each do |row|
                PluginStore.set("procourse_static_pages", row.key, row.value)
                row.destroy # clean up dl_static_pages row
            end
        end
    end
  end
end
