class User < ApplicationRecord
  ORG_ROLES = %w[member org_admin].freeze
  MAP_VISIBILITIES = %w[everyone connections].freeze

  has_secure_password

  belongs_to :organization

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP },
                    uniqueness: { case_sensitive: false }
  validates :org_role, inclusion: { in: ORG_ROLES }
  validates :password, length: { minimum: 8 }, allow_nil: true
  validates :map_visibility, inclusion: { in: MAP_VISIBILITIES }

  normalizes :email, with: ->(e) { e.strip.downcase }

  def org_admin? = org_role == "org_admin"

  def has_location?
    latitude.present? && longitude.present?
  end

  # Projects this user participated in (via roster entries matched by email)
  def participated_projects
    Project.joins(:roster_entries).where(roster_entries: { email: email }).distinct
  end

  def visible_on_map_to?(viewer_org)
    return true if map_visibility == "everyone"
    return true if organization_id == viewer_org.id

    organization.connected_to?(viewer_org)
  end
end
