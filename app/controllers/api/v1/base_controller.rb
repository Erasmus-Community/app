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

      # A user can access the app if:
      #   - they are a platform admin, OR
      #   - they own an approved organization, OR
      #   - they are a participant in any approved organization
      def require_approved_organization
        return unless current_user
        return if current_user.admin?

        approved = current_user.memberships
                               .joins(:organization)
                               .where(organizations: { status: "approved" })
                               .exists?
        return if approved

        owned = current_organization
        if owned
          render json: { error: "Organization not approved yet", status: owned.status },
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
