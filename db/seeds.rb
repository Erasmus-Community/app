# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

admin_org = Organization.find_or_create_by!(name: "Platform Admin") do |o|
  o.country = "PT"
  o.status = "approved"
end

User.find_or_create_by!(email: "admin@example.com") do |u|
  u.organization = admin_org
  u.name = "Admin"
  u.password = "password123"
  u.org_role = "org_admin"
  u.admin = true
end

if Rails.env.development?
  demo = Organization.find_or_create_by!(name: "Juventude em Ação") do |o|
    o.country = "PT"
    o.oid = "E10001111"
    o.status = "approved"
    o.key_actions = %w[KA1 KA2]
    o.expertises = %w[youth inclusion]
    o.languages = %w[pt en]
    o.description = "Portuguese youth NGO running exchanges since 2015."
  end
  User.find_or_create_by!(email: "demo@example.com") do |u|
    u.organization = demo
    u.name = "Demo User"
    u.password = "password123"
    u.org_role = "org_admin"
  end

  Organization.find_or_create_by!(name: "Gioventù Europea") do |o|
    o.country = "IT"
    o.oid = "E10002222"
    o.status = "approved"
    o.key_actions = %w[KA1]
    o.expertises = %w[youth culture environment]
    o.languages = %w[it en]
    o.description = "Italian association focused on youth mobility and environmental education."
  end

  Organization.find_or_create_by!(name: "Waitlisted Org Example") do |o|
    o.country = "ES"
    o.status = "waitlisted"
    o.description = "Pending approval — visible in the admin panel."
  end
end

puts "Seeded. Admin login: admin@example.com / password123"
