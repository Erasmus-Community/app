class Organization < ApplicationRecord
  STATUSES = %w[waitlisted approved rejected].freeze
  KEY_ACTIONS = %w[KA1 KA2 KA3].freeze
  EXPERTISES = %w[youth sport digital inclusion environment culture education health entrepreneurship rural].freeze

  # Legacy FK users (org_admin members via the users.organization_id column)
  has_many :users, dependent: :destroy

  # Multi-org memberships
  has_many :memberships, dependent: :destroy
  has_many :members, through: :memberships, source: :user

  has_many :projects, dependent: :destroy

  validates :name, presence: true
  validates :country, presence: true, length: { is: 2 }
  validates :status, inclusion: { in: STATUSES }
  validate :key_actions_are_known

  scope :approved, -> { where(status: "approved") }
  scope :waitlisted, -> { where(status: "waitlisted") }

  def approved? = status == "approved"

  private

  def key_actions_are_known
    unknown = key_actions - KEY_ACTIONS
    errors.add(:key_actions, "contains unknown values: #{unknown.join(', ')}") if unknown.any?
  end
end
