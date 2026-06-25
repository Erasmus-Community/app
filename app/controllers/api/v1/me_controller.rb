module Api
  module V1
    class MeController < BaseController
      skip_before_action :require_approved_organization

      def show
        render json: MeSerializer.call(current_user)
      end

      # GDPR: delete the user account and all personal data.
      # Any org they own and that has no other members is also deleted.
      def destroy
        ActiveRecord::Base.transaction do
          owned_org = current_user.owned_organization
          current_user.destroy!

          if owned_org && owned_org.members.count.zero?
            owned_org.destroy!
          end
        end

        sign_out
        render json: { message: "Your account and personal data have been permanently deleted." }, status: :ok
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
