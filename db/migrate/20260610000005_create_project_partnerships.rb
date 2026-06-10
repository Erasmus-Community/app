class CreateProjectPartnerships < ActiveRecord::Migration[8.1]
  def change
    create_table :project_partnerships do |t|
      t.references :project, null: false, foreign_key: true
      t.references :organization, null: false, foreign_key: true
      t.timestamps
    end
    add_index :project_partnerships, %i[project_id organization_id], unique: true
  end
end
