require 'rails_helper'

describe PcStaticPages::AdminPagesController do
  let(:user) { Fabricate(:user) }
  let(:admin) { Fabricate(:admin) }

  describe "GET #show" do
    context "as anon" do
      it 'does not allow anonymous users to access' do
          get "/procourse-static-pages/admin/pages.json"
          expect(response.status).to eq(404)
      end
    end

    context "as an ordinary user" do
      before :each do
          sign_in(user)
      end
      it 'does not allow ordinary users to access' do
          get "/procourse-static-pages/admin/pages.json"
          expect(response.status).to eq(404)
      end
    end

    context "as an admin" do
      before :each do
          sign_in(admin)
      end
      it 'allow admin users to access' do
          get "/procourse-static-pages/admin/pages.json"
          expect(response.status).to eq(200)
      end
    end
  end

  describe "POST #create" do
    context "as an admin" do
      before :each do
          sign_in(admin)
      end
      it "allow admin users to update a page" do
        page = {
          active: true,
          title: "test",
          slug: "slug",
          raw: "test raw",
          cooked: "test_cooked",
          custom_slug: "custom slug",
          html: "<h1>test</h1>",
          html_content: "test"
        }
        post "/procourse-static-pages/admin/pages.json", params: { page: page }
        expect(response.status).to eq(200)

        created_page = PluginStoreRow.where(plugin_name: "procourse_static_pages")
          .where("value LIKE '%test_cooked%'")

        expect(created_page[0]["value"]).to be_truthy
      end
    end
  end

  describe "POST #update" do
    context "as an admin" do
      before :each do
          sign_in(admin)
      end
      it "allow admin users to create a page" do
        page = {
          active: true,
          title: "test",
          slug: "slug",
          raw: "test raw",
          cooked: "test_cooked",
          custom_slug: "custom slug",
          html: "<h1>test</h1>",
          html_content: "test"
        }
        post "/procourse-static-pages/admin/pages.json", params: { page: page }
        expect(response.status).to eq(200)

        page[:cooked] = "test_updated"
        page[:id] = response.parsed_body["id"]

        patch "/procourse-static-pages/admin/pages.json", params: { page: page }
        expect(response.status).to eq(200)

        updated_page = PluginStoreRow.where(plugin_name: "procourse_static_pages")
          .where("value LIKE '%test_updated%'")

        expect(updated_page[0]["value"]).to be_truthy
      end
    end
  end

  describe "POST #destroy" do
    context "as an admin" do
      before :each do
          sign_in(admin)
      end
      it "allow admin users to destroy a page" do
        page = {
          active: true,
          title: "test",
          slug: "slug",
          raw: "test raw",
          cooked: "test_cooked",
          custom_slug: "custom slug",
          html: "<h1>test</h1>",
          html_content: "test"
        }
        post "/procourse-static-pages/admin/pages.json", params: { page: page }
        expect(response.status).to eq(200)

        page[:id] = response.parsed_body["id"]

        delete "/procourse-static-pages/admin/pages.json", params: { page: page }
        expect(response.status).to eq(200)

        updated_page = PluginStoreRow.where(plugin_name: "procourse_static_pages")
          .where("value LIKE '%test_cooked%'")

        expect(updated_page[0]).to be_nil
      end
    end
  end

end
