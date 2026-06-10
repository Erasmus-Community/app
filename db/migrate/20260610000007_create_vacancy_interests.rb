class CreateVacancyInterests < ActiveRecord::Migration[8.1]
  def change
    create_table :vacancy_interests do |t|
      t.references :vacancy, null: false, foreign_key: true
      t.references :organization, null: false, foreign_key: true
      t.integer :participant_count, null: false, default: 1
      t.text :message
      t.string :status, null: false, default: "pending"
      t.timestamps
    end
    add_index :vacancy_interests, %i[vacancy_id organization_id], unique: true
  end
end
