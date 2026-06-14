module Api
  module V1
    class AlumniMapController < BaseController
      skip_before_action :require_login
      skip_before_action :require_approved_organization

      def index
        users_with_location = User.where.not(latitude: nil, longitude: nil)
                                  .where(map_visibility: "everyone")
                                  .includes(:organization)

        pins = users_with_location.filter_map do |user|
          next unless user.organization # skip users without an org for now

          {
            id: user.id,
            name: user.name,
            bio: user.bio,
            current_city: user.current_city,
            current_country: user.current_country,
            latitude: user.latitude.to_f,
            longitude: user.longitude.to_f,
            organization: { id: user.organization.id, name: user.organization.name, country: user.organization.country },
            is_me: current_user&.id == user.id
          }
        end

        render json: pins
      end
    end
  end
end
