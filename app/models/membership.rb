class Membership < ApplicationRecord
  ROLES = %w[owner participant].freeze

  belongs_to :user
  belongs_to :organization

  validates :role, inclusion: { in: ROLES }
  validates :user_id, uniqueness: { scope: :organization_id }

  scope :owners,       -> { where(role: "owner") }
  scope :participants, -> { where(role: "participant") }
end
