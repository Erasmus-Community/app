class RemoveLegacyOrgFkFromUsers < ActiveRecord::Migration[8.1]
  def change
    remove_foreign_key :users, :organizations
    remove_index :users, :organization_id
    remove_column :users, :organization_id, :bigint
    remove_column :users, :org_role, :string
  end
end
