class ProjectTask < ApplicationRecord
  belongs_to :project
  belongs_to :assignee_organization, class_name: "Organization", optional: true

  validates :title, presence: true

  scope :ordered, -> { order(Arel.sql("completed_at IS NOT NULL"), due_on: :asc, created_at: :asc) }

  def completed? = completed_at.present?
end
