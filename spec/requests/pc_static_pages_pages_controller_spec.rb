require 'rails_helper'

describe PcStaticPages::AdminPagesController do
  let(:user) { Fabricate(:user) }
  let(:page) {
    id = PluginStore.get("procourse_static_pages", "p:id") || 1
    new_page = {
      id: id,
      active: true,
      title: "test",
      slug: "slug",
      raw: "test raw",
      cooked: "test_cooked",
      custom_slug: "custom slug",
      html: "<h1>test</h1>",
      html_content: "test"
    }
    PluginStore.set("procourse_static_pages", "p:" + id.to_s, new_page)
    PluginStore.set("procourse_static_pages", "p:id", (id.to_i + 1).to_s)
    new_page
  }

  describe "GET #show" do
    context "as an ordinary user" do
      it 'allow ordinary users to access' do
        get "/page/#{page[:id]}.json"
        expect(response.status).to eq(200)
      end
    end
  end
end
