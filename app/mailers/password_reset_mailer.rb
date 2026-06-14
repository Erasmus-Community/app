class PasswordResetMailer < ApplicationMailer
  def reset_email(user)
    @user = user
    @reset_url = "#{frontend_host}/reset-password?token=#{user.reset_password_token}"

    mail(to: user.email, subject: "Reset your password")
  end

  private

  def frontend_host
    Rails.configuration.x.frontend_host || "http://localhost:5173"
  end
end
