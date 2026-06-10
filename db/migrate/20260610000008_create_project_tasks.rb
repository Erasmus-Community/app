class CreateProjectTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :project_tasks do |t|
      t.references :project, null: false, foreign_key: true
      t.references :assignee_organization, foreign_key: { to_table: :organizations }
      t.string :title, null: false
      t.date :due_on
      t.datetime :completed_at
      t.timestamps
    end
  end
end
