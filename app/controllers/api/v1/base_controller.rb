module Api
  module V1
    class BaseController < ApplicationController
      skip_forgery_protection
      before_action :require_login
      before_action :require_approved_organization

      rescue_from ActiveRecord::RecordNotFound do
        render json: { error: "Not found" }, status: :not_found
      end

      rescue_from ActiveRecord::RecordInvalid do |e|
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      private

      def require_login
        render json: { error: "Not signed in" }, status: :unauthorized unless current_user
      end

      def require_approved_organization
        return unless current_user
        return if current_user.admin?
        return if current_organization&.approved?

        if current_organization
          render json: { error: "Organization not approved yet", status: current_organization.status },
                 status: :forbidden
        else
          render json: { error: "No organization linked to your account" },
                 status: :forbidden
        end
      end

      def render_errors(record)
        render json: { errors: record.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
end
