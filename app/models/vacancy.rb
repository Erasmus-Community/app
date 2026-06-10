class Vacancy < ApplicationRecord
  STATUSES = %w[open filled expired].freeze

  belongs_to :project
  has_many :interests, class_name: "VacancyInterest", dependent: :destroy

  validates :title, presence: true
  validates :slots, numericality: { greater_than: 0 }
  validates :status, inclusion: { in: STATUSES }

  has_secure_token :public_token

  scope :open_board, -> { where(status: "open").order(urgent: :desc, deadline: :asc, created_at: :desc) }

  def open? = status == "open"
end
