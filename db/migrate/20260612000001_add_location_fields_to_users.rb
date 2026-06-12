class AddLocationFieldsToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :current_city, :string
    add_column :users, :current_country, :string, limit: 2
    add_column :users, :latitude, :decimal, precision: 10, scale: 6
    add_column :users, :longitude, :decimal, precision: 10, scale: 6
    add_column :users, :map_visibility, :string, default: "everyone", null: false
    add_column :users, :bio, :text

    add_index :users, :map_visibility
  end
end
