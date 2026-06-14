module Api
  module V1
    class RegistrationsController < BaseController
      skip_before_action :require_login
      skip_before_action :require_approved_organization

      # Registers a user (no organization required).
      def create
        user = User.create!(user_params)
        sign_in(user)
        render json: MeSerializer.call(user), status: :created
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      private

      def user_params
        params.require(:user).permit(:name, :email, :password)
      end
    end
  end
end
