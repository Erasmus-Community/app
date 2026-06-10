class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.references :organization, null: false, foreign_key: true
      t.string :name, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :org_role, null: false, default: "member"
      t.boolean :admin, null: false, default: false
      t.timestamps
    end
    add_index :users, "lower(email)", unique: true
  end
end
