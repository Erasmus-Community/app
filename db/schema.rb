# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_15_000001) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "organizations", force: :cascade do |t|
    t.string "country", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.string "expertises", default: [], null: false, array: true
    t.string "key_actions", default: [], null: false, array: true
    t.string "languages", default: [], null: false, array: true
    t.string "name", null: false
    t.string "oid"
    t.string "status", default: "waitlisted", null: false
    t.datetime "updated_at", null: false
    t.string "website"
    t.index ["country"], name: "index_organizations_on_country"
    t.index ["expertises"], name: "index_organizations_on_expertises", using: :gin
    t.index ["key_actions"], name: "index_organizations_on_key_actions", using: :gin
    t.index ["status"], name: "index_organizations_on_status"
  end

  create_table "users", force: :cascade do |t|
    t.boolean "admin", default: false, null: false
    t.text "bio"
    t.datetime "created_at", null: false
    t.string "current_city"
    t.string "current_country", limit: 2
    t.string "email", null: false
    t.decimal "latitude", precision: 10, scale: 6
    t.decimal "longitude", precision: 10, scale: 6
    t.string "map_visibility", default: "everyone", null: false
    t.string "name", null: false
    t.string "org_role", default: "member", null: false
    t.bigint "organization_id"
    t.string "password_digest", null: false
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.datetime "updated_at", null: false
    t.index "lower((email)::text)", name: "index_users_on_lower_email", unique: true
    t.index ["map_visibility"], name: "index_users_on_map_visibility"
    t.index ["organization_id"], name: "index_users_on_organization_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "users", "organizations"
end
