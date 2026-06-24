class CreateMemberships < ActiveRecord::Migration[8.1]
  def change
    create_table :memberships do |t|
      t.references :user, null: false, foreign_key: true
      t.references :organization, null: false, foreign_key: true
      # owner = registered/manages the org
      # participant = appeared in a past project roster
      t.string :role, null: false, default: "participant"

      t.timestamps
    end

    add_index :memberships, [ :user_id, :organization_id ], unique: true
    add_index :memberships, :role
  end
end
