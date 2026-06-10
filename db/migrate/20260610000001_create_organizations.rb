class CreateOrganizations < ActiveRecord::Migration[8.1]
  def change
    create_table :organizations do |t|
      t.string :name, null: false
      t.string :country, null: false # ISO 3166-1 alpha-2
      t.string :oid # Erasmus+ Organisation ID
      t.string :website
      t.text :description
      t.string :status, null: false, default: "waitlisted"
      t.string :key_actions, array: true, null: false, default: []
      t.string :expertises, array: true, null: false, default: []
      t.string :languages, array: true, null: false, default: []
      t.timestamps
    end
    add_index :organizations, :status
    add_index :organizations, :country
    add_index :organizations, :key_actions, using: :gin
    add_index :organizations, :expertises, using: :gin
  end
end
