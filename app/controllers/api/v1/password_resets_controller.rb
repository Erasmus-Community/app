module Api
  module V1
    class PasswordResetsController < BaseController
      skip_before_action :require_login
      skip_before_action :require_approved_organization

      # POST /api/v1/password_reset
      # Request a password reset email
      def create
        user = User.find_by(email: params[:email].to_s.strip.downcase)

        if user
          user.generate_reset_token!
          PasswordResetMailer.reset_email(user).deliver_later
        end

        # Always return success to avoid email enumeration
        render json: { message: "If that email exists, a reset link has been sent" }
      end

      # PATCH /api/v1/password_reset
      # Reset password using token
      def update
        user = User.find_by(reset_password_token: params[:token].to_s)

        if user.nil? || !user.reset_token_valid?
          return render json: { error: "Token is invalid or has expired" }, status: :unprocessable_entity
        end

        if user.update(password: params[:password], password_confirmation: params[:password_confirmation])
          user.clear_reset_token!
          render json: { message: "Password has been reset" }
        else
          render_errors(user)
        end
      end
    end
  end
end
