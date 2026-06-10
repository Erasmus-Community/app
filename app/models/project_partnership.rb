class ProjectPartnership < ApplicationRecord
  belongs_to :project
  belongs_to :organization

  validates :organization_id, uniqueness: { scope: :project_id }
  validate :not_lead_org

  private

  def not_lead_org
    errors.add(:organization, "is already the lead organization") if project && project.organization_id == organization_id
  end
end
