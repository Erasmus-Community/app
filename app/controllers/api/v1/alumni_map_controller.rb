module Api
  module V1
    class AlumniMapController < BaseController
      skip_before_action :require_login
      skip_before_action :require_approved_organization

      def index
        users_with_location = User.where.not(latitude: nil, longitude: nil)
                                  .where(map_visibility: "everyone")
                                  .includes(memberships: :organization, projects: [])

        pins = users_with_location.filter_map do |user|
          # Use the owned org first, fall back to any membership org
          org = user.owned_organization || user.organizations.first
          next unless org

          {
            id: user.id,
            name: user.name,
            bio: user.bio,
            current_city: user.current_city,
            current_country: user.current_country,
            latitude: user.latitude.to_f,
            longitude: user.longitude.to_f,
            organization: { id: org.id, name: org.name, country: org.country },
            is_me: current_user&.id == user.id,
            projects: user.projects.map do |p|
              {
                id: p.id,
                title: p.title,
                project_type: p.project_type,
                key_action: p.key_action,
                venue_country: p.venue_country,
                starts_on: p.starts_on&.iso8601
              }
            end
          }
        end

        render json: pins
      end
    end
  end
end
