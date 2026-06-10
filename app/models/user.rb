class User < ApplicationRecord
  ORG_ROLES = %w[member org_admin].freeze

  has_secure_password

  belongs_to :organization

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP },
                    uniqueness: { case_sensitive: false }
  validates :org_role, inclusion: { in: ORG_ROLES }
  validates :password, length: { minimum: 8 }, allow_nil: true

  normalizes :email, with: ->(e) { e.strip.downcase }

  def org_admin? = org_role == "org_admin"
end
