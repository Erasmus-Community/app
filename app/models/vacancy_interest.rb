class VacancyInterest < ApplicationRecord
  STATUSES = %w[pending accepted declined].freeze

  belongs_to :vacancy
  belongs_to :organization

  validates :participant_count, numericality: { greater_than: 0 }
  validates :status, inclusion: { in: STATUSES }
  validates :organization_id, uniqueness: { scope: :vacancy_id, message: "already expressed interest" }
end
