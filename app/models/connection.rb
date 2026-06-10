class Connection < ApplicationRecord
  STATUSES = %w[pending accepted declined].freeze

  belongs_to :requester, class_name: "Organization"
  belongs_to :addressee, class_name: "Organization"

  validates :status, inclusion: { in: STATUSES }
  validates :requester_id, uniqueness: { scope: :addressee_id }
  validate :not_self

  scope :accepted, -> { where(status: "accepted") }
  scope :pending, -> { where(status: "pending") }
  scope :involving, ->(org) { where("requester_id = :id OR addressee_id = :id", id: org.id) }

  def self.between(a, b)
    where(requester: a, addressee: b).or(where(requester: b, addressee: a)).first
  end

  def accepted? = status == "accepted"

  def other_party(org)
    requester_id == org.id ? addressee : requester
  end

  private

  def not_self
    errors.add(:addressee, "can't connect to yourself") if requester_id == addressee_id
  end
end
