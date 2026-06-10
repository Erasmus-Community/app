class RosterEntry < ApplicationRecord
  belongs_to :project
  belongs_to :organization # sending org

  validates :full_name, presence: true
end
