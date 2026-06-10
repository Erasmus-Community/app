class ProjectResource < ApplicationRecord
  KINDS = %w[link file].freeze

  belongs_to :project
  belongs_to :organization

  validates :title, :url, presence: true
  validates :kind, inclusion: { in: KINDS }
end
