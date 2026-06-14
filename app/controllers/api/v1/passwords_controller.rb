module Api
  module V1
    class PasswordsController < BaseController
      skip_before_action :require_approved_organization

      # PATCH /api/v1/password
      # Authenticated user changes their password
      def update
        unless current_user.authenticate(params[:current_password].to_s)
          return render json: { error: "Current password is incorrect" }, status: :unprocessable_entity
        end

        if current_user.update(password: params[:password], password_confirmation: params[:password_confirmation])
          render json: { message: "Password updated" }
        else
          render_errors(current_user)
        end
      end
    end
  end
end
