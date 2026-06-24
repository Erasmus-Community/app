class User < ApplicationRecord
  ORG_ROLES = %w[member org_admin].freeze
  MAP_VISIBILITIES = %w[everyone connections].freeze

  has_secure_password

  # Legacy single-org FK (kept for MeSerializer / waitlist compat)
  belongs_to :organization, optional: true

  # Multi-org memberships
  has_many :memberships, dependent: :destroy
  has_many :organizations_as_member, through: :memberships, source: :organization

  # Projects participated in via the join table
  has_many :project_participants, dependent: :destroy
  has_many :projects, through: :project_participants

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP },
                    uniqueness: { case_sensitive: false }
  validates :org_role, inclusion: { in: ORG_ROLES }, if: :organization_id?
  validates :password, length: { minimum: 8 }, allow_nil: true
  validates :map_visibility, inclusion: { in: MAP_VISIBILITIES }

  normalizes :email, with: ->(e) { e.strip.downcase }

  def org_admin? = org_role == "org_admin"

  def has_location?
    latitude.present? && longitude.present?
  end

  def owned_organizations
    organizations_as_member.merge(Membership.owners)
  end

  def visible_on_map_to?(viewer_org)
    return true if map_visibility == "everyone"
    return true if organization_id == viewer_org&.id

    false
  end

  # ── Password Reset ──────────────────────────────────────────────

  RESET_TOKEN_EXPIRY = 2.hours

  def generate_reset_token!
    update!(
      reset_password_token: SecureRandom.urlsafe_base64(32),
      reset_password_sent_at: Time.current
    )
  end

  def clear_reset_token!
    update!(reset_password_token: nil, reset_password_sent_at: nil)
  end

  def reset_token_valid?
    reset_password_token.present? &&
      reset_password_sent_at.present? &&
      reset_password_sent_at > RESET_TOKEN_EXPIRY.ago
  end
end
