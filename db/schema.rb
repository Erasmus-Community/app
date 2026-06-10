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

ActiveRecord::Schema[8.1].define(version: 2026_06_10_000010) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "connections", force: :cascade do |t|
    t.bigint "addressee_id", null: false
    t.datetime "created_at", null: false
    t.text "message"
    t.bigint "requester_id", null: false
    t.string "status", default: "pending", null: false
    t.datetime "updated_at", null: false
    t.index ["addressee_id"], name: "index_connections_on_addressee_id"
    t.index ["requester_id", "addressee_id"], name: "index_connections_on_requester_id_and_addressee_id", unique: true
    t.index ["requester_id"], name: "index_connections_on_requester_id"
  end

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

  create_table "project_partnerships", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "organization_id", null: false
    t.bigint "project_id", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_project_partnerships_on_organization_id"
    t.index ["project_id", "organization_id"], name: "index_project_partnerships_on_project_id_and_organization_id", unique: true
    t.index ["project_id"], name: "index_project_partnerships_on_project_id"
  end

  create_table "project_resources", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "kind", default: "link", null: false
    t.bigint "organization_id", null: false
    t.bigint "project_id", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.string "url", null: false
    t.index ["organization_id"], name: "index_project_resources_on_organization_id"
    t.index ["project_id"], name: "index_project_resources_on_project_id"
  end

  create_table "project_tasks", force: :cascade do |t|
    t.bigint "assignee_organization_id"
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.date "due_on"
    t.bigint "project_id", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["assignee_organization_id"], name: "index_project_tasks_on_assignee_organization_id"
    t.index ["project_id"], name: "index_project_tasks_on_project_id"
  end

  create_table "projects", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.date "ends_on"
    t.string "key_action", null: false
    t.bigint "organization_id", null: false
    t.string "project_type", default: "other", null: false
    t.date "starts_on"
    t.string "status", default: "planning", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.string "venue_country"
    t.index ["organization_id"], name: "index_projects_on_organization_id"
    t.index ["status"], name: "index_projects_on_status"
  end

  create_table "roster_entries", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email"
    t.string "full_name", null: false
    t.text "notes"
    t.bigint "organization_id", null: false
    t.bigint "project_id", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_roster_entries_on_organization_id"
    t.index ["project_id"], name: "index_roster_entries_on_project_id"
  end

  create_table "users", force: :cascade do |t|
    t.boolean "admin", default: false, null: false
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name", null: false
    t.string "org_role", default: "member", null: false
    t.bigint "organization_id", null: false
    t.string "password_digest", null: false
    t.datetime "updated_at", null: false
    t.index "lower((email)::text)", name: "index_users_on_lower_email", unique: true
    t.index ["organization_id"], name: "index_users_on_organization_id"
  end

  create_table "vacancies", force: :cascade do |t|
    t.string "countries", default: [], null: false, array: true
    t.datetime "created_at", null: false
    t.date "deadline"
    t.text "participant_profile"
    t.bigint "project_id", null: false
    t.string "public_token", null: false
    t.integer "slots", default: 1, null: false
    t.string "status", default: "open", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.boolean "urgent", default: false, null: false
    t.index ["project_id"], name: "index_vacancies_on_project_id"
    t.index ["public_token"], name: "index_vacancies_on_public_token", unique: true
    t.index ["status", "urgent", "deadline"], name: "index_vacancies_on_status_and_urgent_and_deadline"
  end

  create_table "vacancy_interests", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "message"
    t.bigint "organization_id", null: false
    t.integer "participant_count", default: 1, null: false
    t.string "status", default: "pending", null: false
    t.datetime "updated_at", null: false
    t.bigint "vacancy_id", null: false
    t.index ["organization_id"], name: "index_vacancy_interests_on_organization_id"
    t.index ["vacancy_id", "organization_id"], name: "index_vacancy_interests_on_vacancy_id_and_organization_id", unique: true
    t.index ["vacancy_id"], name: "index_vacancy_interests_on_vacancy_id"
  end

  add_foreign_key "connections", "organizations", column: "addressee_id"
  add_foreign_key "connections", "organizations", column: "requester_id"
  add_foreign_key "project_partnerships", "organizations"
  add_foreign_key "project_partnerships", "projects"
  add_foreign_key "project_resources", "organizations"
  add_foreign_key "project_resources", "projects"
  add_foreign_key "project_tasks", "organizations", column: "assignee_organization_id"
  add_foreign_key "project_tasks", "projects"
  add_foreign_key "projects", "organizations"
  add_foreign_key "roster_entries", "organizations"
  add_foreign_key "roster_entries", "projects"
  add_foreign_key "users", "organizations"
  add_foreign_key "vacancies", "projects"
  add_foreign_key "vacancy_interests", "organizations"
  add_foreign_key "vacancy_interests", "vacancies"
end
