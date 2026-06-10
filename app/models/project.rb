class Project < ApplicationRecord
  STATUSES = %w[planning ongoing completed].freeze
  TYPES = %w[youth_exchange training_course job_shadowing strategic_partnership other].freeze

  belongs_to :organization # lead org
  has_many :project_partnerships, dependent: :destroy
  has_many :partner_organizations, through: :project_partnerships, source: :organization
  has_many :vacancies, dependent: :destroy
  has_many :tasks, class_name: "ProjectTask", dependent: :destroy
  has_many :resources, class_name: "ProjectResource", dependent: :destroy
  has_many :roster_entries, dependent: :destroy

  validates :title, presence: true
  validates :key_action, inclusion: { in: Organization::KEY_ACTIONS }
  validates :project_type, inclusion: { in: TYPES }
  validates :status, inclusion: { in: STATUSES }
  validate :dates_in_order

  def member_org_ids
    [organization_id] + project_partnerships.pluck(:organization_id)
  end

  def accessible_by?(org)
    member_org_ids.include?(org.id)
  end

  private

  def dates_in_order
    return if starts_on.blank? || ends_on.blank?

    errors.add(:ends_on, "must be after the start date") if ends_on < starts_on
  end
end
