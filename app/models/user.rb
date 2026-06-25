class User < ApplicationRecord
  MAP_VISIBILITIES = %w[everyone connections].freeze

  has_secure_password

  has_many :memberships, dependent: :destroy
  has_many :organizations, through: :memberships

  has_many :project_participants, dependent: :destroy
  has_many :projects, through: :project_participants

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP },
                    uniqueness: { case_sensitive: false }
  validates :password, length: { minimum: 8 }, allow_nil: true
  validates :map_visibility, inclusion: { in: MAP_VISIBILITIES }

  normalizes :email, with: ->(e) { e.strip.downcase }

  # The org this user owns (role: "owner"), if any
  def owned_organization
    memberships.find_by(role: "owner")&.organization
  end

  # All orgs the user belongs to (owned + participant)
  def all_organizations
    organizations
  end

  def owner?
    memberships.exists?(role: "owner")
  end

  def owner_of?(org)
    memberships.exists?(organization: org, role: "owner")
  end

  def has_location?
    latitude.present? && longitude.present?
  end

  def visible_on_map_to?(_viewer)
    map_visibility == "everyone"
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
