class CreateProjectResources < ActiveRecord::Migration[8.1]
  def change
    create_table :project_resources do |t|
      t.references :project, null: false, foreign_key: true
      t.references :organization, null: false, foreign_key: true
      t.string :title, null: false
      t.string :url, null: false
      t.string :kind, null: false, default: "link"
      t.timestamps
    end
  end
end
