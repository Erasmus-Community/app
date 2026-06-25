# db/seeds.rb
# Run: bin/rails db:seed
# Reset + reseed: bin/rails db:schema:load db:seed

require "faker"

Faker::Config.locale = "en"

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

ERASMUS_COUNTRIES = %w[AT BE BG CY CZ DE DK EE ES FI FR GR HR HU IE IS IT LI LT LU LV MK MT NL NO PL PT RO RS SE SI SK TR].freeze

KEY_ACTIONS   = %w[KA1 KA2 KA3].freeze
PROJECT_TYPES = %w[youth_exchange training_course strategic_partnership job_shadowing].freeze
EXPERTISES    = %w[youth_work intercultural_dialogue non_formal_education environment digital_skills arts social_inclusion volunteering entrepreneurship youth_policy].freeze
LANGUAGES     = %w[EN DE FR ES PT IT PL RO FI SV NL EL].freeze

# Approximate centroids per country code
CENTROIDS = {
  "AT" => [47.52, 14.55], "BE" => [50.50, 4.47], "BG" => [42.73, 25.48],
  "CY" => [35.13, 33.43], "CZ" => [49.82, 15.47], "DE" => [51.17, 10.45],
  "DK" => [56.26, 9.50],  "EE" => [58.60, 25.01], "ES" => [40.46, -3.75],
  "FI" => [61.92, 25.75], "FR" => [46.23, 2.21],  "GR" => [39.07, 21.82],
  "HR" => [45.10, 15.20], "HU" => [47.16, 19.50], "IE" => [53.41, -8.24],
  "IS" => [64.96, -19.02],"IT" => [41.87, 12.57], "LI" => [47.14, 9.55],
  "LT" => [55.17, 23.88], "LU" => [49.82, 6.13],  "LV" => [56.88, 24.60],
  "MK" => [41.61, 21.75], "MT" => [35.94, 14.38], "NL" => [52.13, 5.29],
  "NO" => [60.47, 8.47],  "PL" => [51.92, 19.15], "PT" => [39.40, -8.22],
  "RO" => [45.94, 24.97], "RS" => [44.02, 21.01], "SE" => [60.13, 18.64],
  "SI" => [46.15, 14.99], "SK" => [48.67, 19.70], "TR" => [38.96, 35.24]
}.freeze

PASSWORD = "password123"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def jitter(coord, delta = 2.5)
  coord + rand(-delta..delta)
end

def seed_user(email:, name:, country:, admin: false)
  lat, lng = CENTROIDS[country]
  User.find_or_initialize_by(email: email).tap do |u|
    u.name            = name
    u.password        = PASSWORD
    u.admin           = admin
    u.current_city    = Faker::Address.city
    u.current_country = country
    u.latitude        = jitter(lat)
    u.longitude       = jitter(lng)
    u.bio             = Faker::Lorem.sentence(word_count: 12)
    u.map_visibility  = "everyone"
    u.save!
  end
end

def seed_org(name:, country:, status: "approved")
  Organization.find_or_initialize_by(name: name).tap do |o|
    o.country     = country
    o.status      = status
    o.oid         = "E#{rand(10_000_000..99_999_999)}"
    o.website     = Faker::Internet.url
    o.description = Faker::Lorem.paragraph(sentence_count: 3)
    o.key_actions = KEY_ACTIONS.sample(rand(1..2))
    o.expertises  = EXPERTISES.sample(rand(2..4))
    o.languages   = (["EN"] + LANGUAGES.sample(2)).uniq
    o.save!
  end
end

def seed_project(org:, country:)
  starts = Faker::Date.between(from: 2.years.ago, to: 6.months.from_now)
  Project.find_or_initialize_by(title: Faker::Lorem.sentence(word_count: 4, supplemental: false).chomp("."), organization: org).tap do |p|
    p.project_type  = PROJECT_TYPES.sample
    p.key_action    = KEY_ACTIONS.sample
    p.venue_country = ERASMUS_COUNTRIES.sample
    p.starts_on     = starts
    p.ends_on       = starts + rand(5..14).days
    p.description   = Faker::Lorem.paragraph(sentence_count: 2)
    p.save!
  end
end

# ---------------------------------------------------------------------------
# Admin
# ---------------------------------------------------------------------------

admin = seed_user(email: "admin@example.com", name: "Admin", country: "BE", admin: true)
demo  = seed_user(email: "demo@example.com",  name: "Demo User", country: "PT")

# ---------------------------------------------------------------------------
# Organizations + owners
# ---------------------------------------------------------------------------

ORG_SPECS = [
  { name: "YouthConnect Portugal",       country: "PT" },
  { name: "Green Generation Poland",     country: "PL" },
  { name: "Solidarity Corps Deutschland",country: "DE" },
  { name: "Creative Minds Romania",      country: "RO" },
  { name: "Nordic Youth Forum",          country: "FI" },
  { name: "Horizonte Joven España",      country: "ES" },
  { name: "Mladi Most Croatia",          country: "HR" },
  { name: "Athens Youth Lab",            country: "GR" },
  { name: "Baltic Bridge Lithuania",     country: "LT", status: "waitlisted" },
].freeze

orgs = ORG_SPECS.map do |spec|
  org = seed_org(**spec)

  owner_country = spec[:country]
  slug = org.name.downcase
              .unicode_normalize(:nfd).gsub(/\p{Mn}/, "")  # strip accents
              .gsub(/[^a-z0-9]+/, ".")                      # non-alnum → dot
              .gsub(/\A\.+|\.+\z/, "")                      # trim leading/trailing dots
  owner = seed_user(
    email:   "owner.#{slug}@example.com",
    name:    Faker::Name.name,
    country: owner_country
  )
  Membership.find_or_create_by!(user: owner, organization: org, role: "owner")

  org
end

approved_orgs = orgs.select { |o| o.status == "approved" }

# ---------------------------------------------------------------------------
# Extra participants (no org ownership)
# ---------------------------------------------------------------------------

participant_countries = %w[PT PL DE RO FI ES HR GR AT FR IT NL]

participants = 20.times.map do |i|
  country = participant_countries[i % participant_countries.size]
  seed_user(
    email:   "participant#{i + 1}@example.com",
    name:    Faker::Name.name,
    country: country
  )
end

all_non_admin = participants + [demo]

# ---------------------------------------------------------------------------
# Projects + participants
# ---------------------------------------------------------------------------

approved_orgs.each do |org|
  rand(2..3).times do
    project = seed_project(org: org, country: org.country)

    # Pick 3–6 random participants
    attendees = all_non_admin.sample(rand(3..6))
    attendees.each do |user|
      ProjectParticipant.find_or_create_by!(project: project, user: user)
      Membership.find_or_create_by!(user: user, organization: org, role: "participant")
    end
  end
end
