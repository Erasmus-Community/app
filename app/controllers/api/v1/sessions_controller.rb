module Api
  module V1
    class SessionsController < BaseController
      skip_before_action :require_login, only: :create
      skip_before_action :require_approved_organization, only: %i[create destroy]

      def create
        user = User.find_by(email: params[:email].to_s.strip.downcase)
        if user&.authenticate(params[:password])
          sign_in(user)
          render json: MeSerializer.call(user), status: :created
        else
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def destroy
        sign_out
        head :no_content
      end
    end
  end
end
