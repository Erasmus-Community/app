class Project < ApplicationRecord
  PROJECT_TYPES = %w[youth_exchange training_course job_shadowing strategic_partnership other].freeze
  KEY_ACTIONS   = %w[KA1 KA2 KA3].freeze

  belongs_to :organization

  has_many :project_participants, dependent: :destroy
  has_many :users, through: :project_participants

  validates :title,        presence: true
  validates :project_type, inclusion: { in: PROJECT_TYPES }
  validates :key_action,   inclusion: { in: KEY_ACTIONS }
  validates :venue_country, length: { is: 2 }, allow_blank: true
end
