class CreateProjects < ActiveRecord::Migration[8.1]
  def change
    create_table :projects do |t|
      t.references :organization, null: false, foreign_key: true
      t.string  :title,        null: false
      t.string  :project_type, null: false
      t.string  :key_action,   null: false
      t.string  :venue_country, limit: 2
      t.date    :starts_on
      t.date    :ends_on
      t.text    :description

      t.timestamps
    end

    add_index :projects, :project_type
    add_index :projects, :key_action
  end
end
