class CreateConnections < ActiveRecord::Migration[8.1]
  def change
    create_table :connections do |t|
      t.references :requester, null: false, foreign_key: { to_table: :organizations }
      t.references :addressee, null: false, foreign_key: { to_table: :organizations }
      t.string :status, null: false, default: "pending"
      t.text :message
      t.timestamps
    end
    add_index :connections, %i[requester_id addressee_id], unique: true
  end
end
