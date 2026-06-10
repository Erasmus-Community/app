class CreateRosterEntries < ActiveRecord::Migration[8.1]
  def change
    create_table :roster_entries do |t|
      t.references :project, null: false, foreign_key: true
      t.references :organization, null: false, foreign_key: true # sending org
      t.string :full_name, null: false
      t.string :email
      t.text :notes
      t.timestamps
    end
  end
end
