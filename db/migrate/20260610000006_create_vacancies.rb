class CreateVacancies < ActiveRecord::Migration[8.1]
  def change
    create_table :vacancies do |t|
      t.references :project, null: false, foreign_key: true
      t.string :title, null: false
      t.integer :slots, null: false, default: 1
      t.text :participant_profile
      t.string :countries, array: true, null: false, default: []
      t.date :deadline
      t.boolean :urgent, null: false, default: false
      t.string :status, null: false, default: "open"
      t.string :public_token, null: false
      t.timestamps
    end
    add_index :vacancies, :public_token, unique: true
    add_index :vacancies, %i[status urgent deadline]
  end
end
