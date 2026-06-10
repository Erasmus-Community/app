module Api
  module V1
    class RegistrationsController < BaseController
      skip_before_action :require_login
      skip_before_action :require_approved_organization

      # Registers an organization + its first user (org_admin). Org starts waitlisted.
      def create
        ActiveRecord::Base.transaction do
          org = Organization.create!(organization_params)
          user = org.users.create!(user_params.merge(org_role: "org_admin"))
          sign_in(user)
          render json: MeSerializer.call(user), status: :created
        end
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      private

      def organization_params
        params.require(:organization)
              .permit(:name, :country, :oid, :website, :description,
                      key_actions: [], expertises: [], languages: [])
      end

      def user_params
        params.require(:user).permit(:name, :email, :password)
      end
    end
  end
end
