module Api
  module V1
    class AlumniMapController < BaseController
      def index
        users_with_location = User.where.not(latitude: nil, longitude: nil)
                                  .includes(:organization)

        pins = users_with_location.filter_map do |user|
          next unless user.visible_on_map_to?(current_organization)

          # projects = user.participated_projects
          #               .select(:id, :title, :project_type, :venue_country, :starts_on, :ends_on, :status)

          {
            id: user.id,
            name: user.name,
            bio: user.bio,
            current_city: user.current_city,
            current_country: user.current_country,
            latitude: user.latitude.to_f,
            longitude: user.longitude.to_f,
            organization: { id: user.organization.id, name: user.organization.name, country: user.organization.country },
            # projects: projects.map do |p|
            #   { id: p.id, title: p.title, project_type: p.project_type,
            #     venue_country: p.venue_country, starts_on: p.starts_on, ends_on: p.ends_on, status: p.status }
            # end,
            is_me: user.id == current_user.id
          }
        end

        render json: pins
      end
    end
  end
end
