class Organization < ApplicationRecord
  STATUSES = %w[waitlisted approved rejected].freeze
  KEY_ACTIONS = %w[KA1 KA2 KA3].freeze
  EXPERTISES = %w[youth sport digital inclusion environment culture education health entrepreneurship rural].freeze

  has_many :users, dependent: :destroy
  has_many :projects, dependent: :destroy
  has_many :project_partnerships, dependent: :destroy
  has_many :partner_projects, through: :project_partnerships, source: :project
  has_many :sent_connections, class_name: "Connection", foreign_key: :requester_id,
                              dependent: :destroy, inverse_of: :requester
  has_many :received_connections, class_name: "Connection", foreign_key: :addressee_id,
                                  dependent: :destroy, inverse_of: :addressee
  has_many :vacancy_interests, dependent: :destroy

  validates :name, presence: true
  validates :country, presence: true, length: { is: 2 }
  validates :status, inclusion: { in: STATUSES }
  validate :key_actions_are_known

  scope :approved, -> { where(status: "approved") }
  scope :waitlisted, -> { where(status: "waitlisted") }

  def approved? = status == "approved"

  def connection_with(other)
    Connection.between(self, other)
  end

  def connected_to?(other)
    connection_with(other)&.accepted? || false
  end

  def network_ids
    Connection.accepted.where("requester_id = :id OR addressee_id = :id", id: id)
              .pluck(:requester_id, :addressee_id).flatten.uniq - [id]
  end

  private

  def key_actions_are_known
    unknown = key_actions - KEY_ACTIONS
    errors.add(:key_actions, "contains unknown values: #{unknown.join(', ')}") if unknown.any?
  end
end
