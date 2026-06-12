module Api
  module V1
    class MeController < BaseController
      skip_before_action :require_approved_organization

      def show
        render json: MeSerializer.call(current_user)
      end

      def update_location
        if current_user.update(location_params)
          render json: {
            latitude: current_user.latitude.to_f,
            longitude: current_user.longitude.to_f,
            current_city: current_user.current_city,
            current_country: current_user.current_country,
            map_visibility: current_user.map_visibility,
            bio: current_user.bio
          }
        else
          render_errors(current_user)
        end
      end

      private

      def location_params
        params.permit(:current_city, :current_country, :latitude, :longitude, :map_visibility, :bio)
      end
    end
  end
end
